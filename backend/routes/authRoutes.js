import express from "express"
import { body } from "express-validator"
import { login, getMe, logout } from "../controllers/authController.js"
import { protect } from "../middleware/auth.js"
import { validate } from "../middleware/validate.js"

const router = express.Router()

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
    validate,
  ],
  login,
)

router.get("/me", protect, getMe)
router.post("/logout", protect, logout)

export default router
