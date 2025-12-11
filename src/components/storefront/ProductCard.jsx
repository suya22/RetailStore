"use client"

import { Link } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import { formatPrice } from "../../utils/currency"

function ProductCard({ product }) {
  const { addItem, items } = useCart()
  const cartItem = items.find((item) => item.productId === product._id)
  const canAddMore = !cartItem || cartItem.quantity < product.stock

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (canAddMore) {
      addItem(product)
    }
  }

  const imageUrl = product.imageUrl
    ? product.imageUrl.startsWith("/")
      ? product.imageUrl
      : `/uploads/${product.imageUrl}`
    : "/diverse-products-still-life.png"

  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Product Image */}
        <div className="aspect-square bg-white p-4 flex items-center justify-center border-b border-gray-100">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={product.name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-sm text-gray-800 line-clamp-2 mb-2 group-hover:text-primary-500 transition-colors min-h-[40px]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.price > 500 && <span className="text-xs text-green-600 font-medium">Free Delivery</span>}
          </div>

          {/* Stock Status */}
          {product.stock <= 10 && product.stock > 0 && (
            <p className="text-xs text-red-600 font-medium mb-2">Only {product.stock} left in stock</p>
          )}

          {product.stock === 0 && <p className="text-xs text-red-600 font-medium mb-2">Currently unavailable</p>}

          {/* Category Badge */}
          <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-sm">
            {product.category}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
