"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { fetchProduct } from "../../services/api"
import { useCart } from "../../context/CartContext"
import QuantitySelector from "../../components/storefront/QuantitySelector"
import { ChevronLeftIcon, SpinnerIcon, CheckCircleIcon } from "../../components/Icons"
import { formatPrice } from "../../utils/currency"

function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem, items } = useCart()

  const cartItem = items.find((item) => item.productId === id)
  const availableStock = product ? product.stock - (cartItem?.quantity || 0) : 0

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProduct(id)
        setProduct(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  useEffect(() => {
    if (product && availableStock > 0) {
      setQuantity(1)
    }
  }, [product, availableStock])

  const handleAddToCart = () => {
    if (product && quantity > 0 && quantity <= availableStock) {
      addItem(product, quantity)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
      setQuantity(1)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <SpinnerIcon className="w-10 h-10 text-primary-500" />
        <p className="mt-4 text-gray-500 text-sm">Loading product...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-20 text-center">
          <p className="text-red-600 mb-4">{error || "Product not found"}</p>
          <Link to="/" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const imageUrl = product.imageUrl
    ? product.imageUrl.startsWith("/")
      ? product.imageUrl
      : `/uploads/${product.imageUrl}`
    : "/diverse-products-still-life.png"

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 text-sm">
        <ChevronLeftIcon className="w-4 h-4 mr-1" />
        Back to Results
      </Link>

      <div className="card">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 p-6">
          {/* Product Image */}
          <div className="lg:col-span-2">
            <div className="aspect-square bg-white border border-gray-200 rounded-sm flex items-center justify-center p-8 sticky top-20">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-2">
            <span className="text-xs text-primary-600 font-medium uppercase tracking-wide">{product.category}</span>
            <h1 className="text-xl font-medium text-gray-900 mt-1 mb-4">{product.name}</h1>

            <div className="border-t border-b py-4 my-4">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-gray-500">Price:</span>
                <span className="text-2xl font-medium text-gray-900">{formatPrice(product.price)}</span>
              </div>
              {product.price > 500 && <p className="text-xs text-green-600 mt-1">FREE Delivery</p>}
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">About this item</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* Buy Box */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-sm p-4">
              <p className="text-xl font-medium text-gray-900 mb-2">{formatPrice(product.price)}</p>

              {product.price > 500 && (
                <p className="text-xs text-gray-600 mb-3">
                  FREE delivery <span className="font-medium text-gray-900">Tomorrow</span>
                </p>
              )}

              {/* Stock Status */}
              <div className="mb-4">
                {product.stock > 10 ? (
                  <span className="text-sm text-green-700 font-medium">In Stock</span>
                ) : product.stock > 0 ? (
                  <span className="text-sm text-red-600 font-medium">
                    Only {product.stock} left in stock - order soon
                  </span>
                ) : (
                  <span className="text-sm text-red-600 font-medium">Currently unavailable</span>
                )}
              </div>

              {product.stock > 0 && availableStock > 0 && (
                <>
                  <div className="mb-4">
                    <label className="text-sm text-gray-700 mb-1 block">Quantity:</label>
                    <QuantitySelector value={quantity} onChange={setQuantity} max={availableStock} min={1} />
                  </div>

                  <div className="space-y-2">
                    <button onClick={handleAddToCart} disabled={addedToCart} className="btn btn-primary w-full">
                      {addedToCart ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4" />
                          Added to Cart
                        </>
                      ) : (
                        "Add to Cart"
                      )}
                    </button>
                    <Link to="/checkout" className="btn btn-secondary w-full text-center">
                      Buy Now
                    </Link>
                  </div>
                </>
              )}

              {cartItem && (
                <p className="text-xs text-gray-500 mt-3 text-center">{cartItem.quantity} already in cart</p>
              )}

              {/* Trust Badges */}
              <div className="mt-4 pt-4 border-t space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  Secure transaction
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  Cash on Delivery available
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  Easy returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
