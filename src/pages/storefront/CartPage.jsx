"use client"

import { Link } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import QuantitySelector from "../../components/storefront/QuantitySelector"
import { formatPrice } from "../../utils/currency"

function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, tax, total } = useCart()

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid lg:grid-cols-4 gap-4">
        {/* Cart Items */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="p-4 border-b">
              <h1 className="text-2xl font-medium text-gray-900">Shopping Cart</h1>
            </div>

            <div className="divide-y">
              {items.map((item) => {
                const imageUrl = item.imageUrl
                  ? item.imageUrl.startsWith("/")
                    ? item.imageUrl
                    : `/uploads/${item.imageUrl}`
                  : "/diverse-products-still-life.png"

                return (
                  <div key={item.productId} className="p-4 flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-white border border-gray-200 rounded-sm flex items-center justify-center">
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain p-2"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-green-600 mt-1">In Stock</p>

                      <div className="flex items-center gap-4 mt-3">
                        <QuantitySelector
                          value={item.quantity}
                          onChange={(qty) => updateQuantity(item.productId, qty)}
                          max={item.maxStock}
                          min={1}
                        />
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-primary-600 hover:text-primary-700 text-sm hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                      {item.quantity > 1 && <p className="text-xs text-gray-500">{formatPrice(item.price)} each</p>}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="p-4 border-t text-right">
              <p className="text-lg">
                Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items):{" "}
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-4 sticky top-20">
            <div className="text-sm text-green-600 mb-3 flex items-center gap-2">
              <CheckIcon className="w-4 h-4" />
              Your order is eligible for FREE Delivery
            </div>

            <p className="text-sm mb-4">
              Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items):{" "}
              <span className="font-bold">{formatPrice(subtotal)}</span>
            </p>

            <Link to="/checkout" className="btn btn-primary w-full">
              Proceed to Buy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default CartPage
