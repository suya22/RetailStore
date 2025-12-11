import Order from "../models/Order.js"
import Product from "../models/Product.js"
import { ORDER_STATUS, TAX_RATE, PAGINATION, PRODUCT_STATUS } from "../config/constants.js"

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { customerName, email, contactNumber, shippingAddress, items } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in order",
      })
    }

    // Validate and process items
    const orderItems = []
    let subtotal = 0

    for (const item of items) {
      const product = await Product.findOne({
        _id: item.productId,
        status: PRODUCT_STATUS.ACTIVE,
      })

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found or inactive: ${item.productId}`,
        })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        })
      }

      const lineTotal = product.price * item.quantity
      subtotal += lineTotal

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        lineTotal,
      })
    }

    const tax = subtotal * TAX_RATE
    const total = subtotal + tax

    // Create order
    const order = await Order.create({
      customerName,
      email,
      contactNumber,
      shippingAddress,
      items: orderItems,
      subtotal,
      tax,
      total,
      status: ORDER_STATUS.NEW,
    })

    // Reduce stock for each item
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      })
    }

    res.status(201).json({
      success: true,
      data: order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get order by ID (public)
// @route   GET /api/orders/:id
// @access  Public
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ============ ADMIN CONTROLLERS ============

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private
export const adminGetOrders = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE
    const limit = Math.min(Number.parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT)
    const skip = (page - 1) * limit

    const query = {}

    // Status filter
    if (req.query.status) {
      query.status = req.query.status
    }

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {}
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate)
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(req.query.endDate + "T23:59:59.999Z")
      }
    }

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(query),
    ])

    res.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get order by ID (admin)
// @route   GET /api/admin/orders/:id
// @access  Private
export const adminGetOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    if (!Object.values(ORDER_STATUS).includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      })
    }

    const previousStatus = order.status

    // If cancelling an order that wasn't cancelled before, restore stock
    if (status === ORDER_STATUS.CANCELLED && previousStatus !== ORDER_STATUS.CANCELLED) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        })
      }
    }

    // If un-cancelling an order (changing from cancelled to another status), reduce stock again
    if (previousStatus === ORDER_STATUS.CANCELLED && status !== ORDER_STATUS.CANCELLED) {
      for (const item of order.items) {
        const product = await Product.findById(item.productId)
        if (product && product.stock >= item.quantity) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity },
          })
        } else {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock to restore order. Product: ${item.productName}`,
          })
        }
      }
    }

    order.status = status
    await order.save()

    res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Today's orders
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    })

    // Today's revenue (excluding cancelled orders)
    const todayRevenueResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
          status: { $ne: ORDER_STATUS.CANCELLED },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ])
    const todayRevenue = todayRevenueResult[0]?.total || 0

    // Low stock products count
    const lowStockCount = await Product.countDocuments({
      stock: { $lte: 10 },
      status: PRODUCT_STATUS.ACTIVE,
    })

    // Total products
    const totalProducts = await Product.countDocuments()

    // Total orders
    const totalOrders = await Order.countDocuments()

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    res.json({
      success: true,
      data: {
        todayOrders,
        todayRevenue,
        lowStockCount,
        totalProducts,
        totalOrders,
        ordersByStatus: ordersByStatus.reduce((acc, item) => {
          acc[item._id] = item.count
          return acc
        }, {}),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
