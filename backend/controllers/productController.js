import Product from "../models/Product.js"
import { PRODUCT_STATUS, PAGINATION } from "../config/constants.js"


export const getProducts = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE
    const limit = Math.min(Number.parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT)
    const skip = (page - 1) * limit

    const query = { status: PRODUCT_STATUS.ACTIVE }

    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search }
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category
    }

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ])

    res.json({
      success: true,
      data: products,
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

// @desc    Get single product (public)
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      status: PRODUCT_STATUS.ACTIVE,
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", { status: PRODUCT_STATUS.ACTIVE })
    res.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ============ ADMIN CONTROLLERS ============

// @desc    Get all products (admin - all statuses)
// @route   GET /api/admin/products
// @access  Private
export const adminGetProducts = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE
    const limit = Math.min(Number.parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT)
    const skip = (page - 1) * limit

    const query = {}

    if (req.query.status) {
      query.status = req.query.status
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { category: { $regex: req.query.search, $options: "i" } },
      ]
    }

    if (req.query.category) {
      query.category = req.query.category
    }

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ])

    res.json({
      success: true,
      data: products,
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

// @desc    Get single product (admin)
// @route   GET /api/admin/products/:id
// @access  Private
export const adminGetProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private
export const createProduct = async (req, res) => {
  try {
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      status: req.body.status || PRODUCT_STATUS.ACTIVE,
    }

    if (req.file) {
      productData.imageUrl = `/uploads/${req.file.filename}`
    }

    const product = await Product.create(productData)

    res.status(201).json({
      success: true,
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      status: req.body.status,
    }

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })

    res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Toggle product status
// @route   PATCH /api/admin/products/:id/toggle-status
// @access  Private
export const toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    product.status = product.status === PRODUCT_STATUS.ACTIVE ? PRODUCT_STATUS.INACTIVE : PRODUCT_STATUS.ACTIVE

    await product.save()

    res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get low stock products
// @route   GET /api/admin/products/low-stock
// @access  Private
export const getLowStockProducts = async (req, res) => {
  try {
    const threshold = Number.parseInt(req.query.threshold) || 10

    const products = await Product.find({
      stock: { $lte: threshold },
      status: PRODUCT_STATUS.ACTIVE,
    })
      .sort({ stock: 1 })
      .limit(10)

    res.json({
      success: true,
      data: products,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
