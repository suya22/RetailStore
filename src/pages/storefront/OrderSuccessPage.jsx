"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { fetchOrder } from "../../services/api"
import { CheckCircleIcon, SpinnerIcon } from "../../components/Icons"
import { formatPrice } from "../../utils/currency"

function OrderSuccessPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true)
        const data = await fetchOrder(orderId)
        setOrder(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <SpinnerIcon className="w-10 h-10 text-primary-500" />
        <p className="mt-4 text-gray-500 text-sm">Loading order details...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-20 text-center">
          <p className="text-red-600 mb-4">{error || "Order not found"}</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Success Header */}
      <div className="card mb-4">
        <div className="p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-lg font-medium text-green-700">Order placed, thank you!</h1>
            <p className="text-sm text-gray-600 mt-1">Confirmation will be sent to your email.</p>
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="card mb-4">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-wrap justify-between gap-4 text-sm">
            <div>
              <span className="text-gray-500">Order placed</span>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Total</span>
              <p className="font-medium">{formatPrice(order.total)}</p>
            </div>
            <div>
              <span className="text-gray-500">Ship to</span>
              <p className="font-medium text-primary-600">{order.customerName}</p>
            </div>
            <div className="text-right">
              <span className="text-gray-500">Order #</span>
              <p className="font-mono text-sm">{order._id}</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-sm">{order.status}</span>
            <span className="text-sm text-gray-600">Expected delivery in 3-5 business days</span>
          </div>

          {/* Order Items */}
          <div className="divide-y">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-4 py-4">
                <div className="w-20 h-20 bg-gray-100 rounded-sm flex items-center justify-center">
                  <img
                    src="/diverse-products-still-life.png"
                    alt={item.productName}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline cursor-pointer">
                    {item.productName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
                  <p className="text-sm font-medium mt-1">{formatPrice(item.lineTotal)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="card mb-4">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-medium text-gray-900">Delivery address</h2>
        </div>
        <div className="p-4 text-sm text-gray-600">
          <p className="font-medium text-gray-900">{order.customerName}</p>
          <p className="whitespace-pre-line mt-1">{order.shippingAddress}</p>
          <p className="mt-2">{order.contactNumber}</p>
          <p>{order.email}</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="card mb-6">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-medium text-gray-900">Order summary</h2>
        </div>
        <div className="p-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Items:</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery:</span>
            <span className="text-green-600">FREE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">GST:</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t font-bold text-lg text-red-700">
            <span>Order Total:</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default OrderSuccessPage
