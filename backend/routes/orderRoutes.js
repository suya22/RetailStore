import express from "express"
import { body } from "express-validator"
import { createOrder, getOrder } from "../controllers/orderController.js"
import { validate } from "../middleware/validate.js"

const router = express.Router()

router.post(
  "/",
  [
    body("customerName")
      .notEmpty()
      .withMessage("Customer name is required")
      .isLength({ max: 100 })
      .withMessage("Name cannot exceed 100 characters"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("contactNumber")
      .notEmpty()
      .withMessage("Contact number is required")
      .isLength({ max: 20 })
      .withMessage("Contact number cannot exceed 20 characters"),
    body("shippingAddress")
      .notEmpty()
      .withMessage("Shipping address is required")
      .isLength({ max: 500 })
      .withMessage("Address cannot exceed 500 characters"),
    body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
    body("items.*.productId").notEmpty().withMessage("Product ID is required"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    validate,
  ],
  createOrder,
)

router.get("/:id", getOrder)

export default router
