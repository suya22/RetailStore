"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import { createOrder } from "../../services/api"
import { SpinnerIcon } from "../../components/Icons"
import { formatPrice, TAX_LABEL } from "../../utils/currency"

const initialFormState = {
  customerName: "",
  email: "",
  contactNumber: "",
  shippingAddress: "",
}

function CheckoutPage() {
  const { items, subtotal, tax, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-20 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6 text-sm">Add items to get started</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Name is required"
    } else if (formData.customerName.length > 100) {
      newErrors.customerName = "Name must be less than 100 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required"
    } else if (formData.contactNumber.length > 20) {
      newErrors.contactNumber = "Contact number must be less than 20 characters"
    }

    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = "Shipping address is required"
    } else if (formData.shippingAddress.length > 500) {
      newErrors.shippingAddress = "Address must be less than 500 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setSubmitError(null)

    try {
      const orderData = {
        ...formData,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }

      const result = await createOrder(orderData)
      clearCart()
      navigate(`/order-success/${result.data._id}`)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <h1 className="text-2xl font-medium text-gray-900 mb-6 pb-4 border-b">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Shipping Address */}
            <div className="card mb-4">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-medium text-gray-900">1. Delivery address</h2>
              </div>
              <div className="p-4 space-y-4">
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm">
                    {submitError}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="customerName" className="label">
                      Full name
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      className={`input ${errors.customerName ? "border-red-500 focus:ring-red-500" : ""}`}
                    />
                    {errors.customerName && <p className="text-red-600 text-xs mt-1">{errors.customerName}</p>}
                  </div>

                  <div>
                    <label htmlFor="contactNumber" className="label">
                      Mobile number
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="+91"
                      className={`input ${errors.contactNumber ? "border-red-500 focus:ring-red-500" : ""}`}
                    />
                    {errors.contactNumber && <p className="text-red-600 text-xs mt-1">{errors.contactNumber}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="label">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="shippingAddress" className="label">
                    Address
                  </label>
                  <textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Street address, City, State, PIN Code"
                    className={`input resize-none ${errors.shippingAddress ? "border-red-500 focus:ring-red-500" : ""}`}
                  />
                  {errors.shippingAddress && <p className="text-red-600 text-xs mt-1">{errors.shippingAddress}</p>}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card mb-4">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-medium text-gray-900">2. Review items</h2>
              </div>
              <div className="p-4 divide-y">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-sm flex items-center justify-center">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="card">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-medium text-gray-900">3. Payment method</h2>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 p-3 border border-primary-500 bg-primary-50 rounded-sm">
                  <input type="radio" id="cod" name="payment" defaultChecked className="text-primary-600" />
                  <label htmlFor="cod" className="text-sm font-medium text-gray-900">
                    Cash on Delivery (COD)
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-4 py-3">
              {loading ? (
                <>
                  <SpinnerIcon className="w-5 h-5" />
                  Processing...
                </>
              ) : (
                `Place Order`
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-4 sticky top-20">
            <h3 className="font-medium text-gray-900 pb-3 border-b mb-3">Order Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items ({items.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery:</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{TAX_LABEL}:</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="border-t mt-3 pt-3 flex justify-between text-lg font-bold text-red-700">
              <span>Order Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
