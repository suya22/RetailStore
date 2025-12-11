import jwt from "jsonwebtoken"
import AdminUser from "../models/AdminUser.js"

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      })
    }

    const admin = await AdminUser.findOne({ email }).select("+password")

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    const isMatch = await admin.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    const token = generateToken(admin._id)

    res.json({
      success: true,
      data: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        token,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


export const getMe = async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.admin._id,
      email: req.admin.email,
      role: req.admin.role,
    },
  })
}

// @desc    Logout admin (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  })
}
