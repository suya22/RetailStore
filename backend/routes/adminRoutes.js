import express from "express"
import { body } from "express-validator"
import { protect } from "../middleware/auth.js"
import { validate } from "../middleware/validate.js"
import upload from "../middleware/upload.js"
import {
  adminGetProducts,
  adminGetProduct,
  createProduct,
  updateProduct,
  toggleProductStatus,
  getLowStockProducts,
} from "../controllers/productController.js"
import { adminGetOrders, adminGetOrder, updateOrderStatus, getDashboardStats } from "../controllers/orderController.js"

const router = express.Router()

// Apply auth middleware to all admin routes
router.use(protect)

// Dashboard
router.get("/dashboard", getDashboardStats)

// Products
router.get("/products/low-stock", getLowStockProducts)
router.get("/products", adminGetProducts)
router.get("/products/:id", adminGetProduct)
router.post(
  "/products",
  upload.single("image"),
  [
    body("name")
      .notEmpty()
      .withMessage("Product name is required")
      .isLength({ max: 200 })
      .withMessage("Name cannot exceed 200 characters"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ max: 2000 })
      .withMessage("Description cannot exceed 2000 characters"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
    body("category").notEmpty().withMessage("Category is required"),
    validate,
  ],
  createProduct,
)
router.put(
  "/products/:id",
  upload.single("image"),
  [
    body("name")
      .notEmpty()
      .withMessage("Product name is required")
      .isLength({ max: 200 })
      .withMessage("Name cannot exceed 200 characters"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ max: 2000 })
      .withMessage("Description cannot exceed 2000 characters"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
    body("category").notEmpty().withMessage("Category is required"),
    validate,
  ],
  updateProduct,
)
router.patch("/products/:id/toggle-status", toggleProductStatus)

// Orders
router.get("/orders", adminGetOrders)
router.get("/orders/:id", adminGetOrder)
router.patch(
  "/orders/:id/status",
  [body("status").notEmpty().withMessage("Status is required"), validate],
  updateOrderStatus,
)

export default router
