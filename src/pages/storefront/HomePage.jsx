"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchProducts, fetchCategories } from "../../services/api"
import ProductCard from "../../components/storefront/ProductCard"
import Pagination from "../../components/Pagination"
import { SearchIcon, SpinnerIcon } from "../../components/Icons"

function HomePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchProducts({
        search: debouncedSearch,
        category: selectedCategory,
        page,
        limit: 12,
      })
      setProducts(data.data)
      setPagination(data.pagination)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, selectedCategory, page])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data.data))
      .catch((err) => console.error("Failed to load categories:", err))
  }, [])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Promo Banner */}
      <div className="bg-primary-600 text-white p-4 rounded-sm mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Welcome to RetailHub</h2>
          <p className="text-sm text-primary-100">India's favorite online shopping destination</p>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Free Delivery on orders above ₹499
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
            Cash on Delivery Available
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="card p-4 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-3 pb-2 border-b text-sm uppercase tracking-wide">Filters</h3>

            {/* Categories */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Categories</h4>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategoryChange("")}
                  className={`block w-full text-left px-2 py-1.5 text-sm rounded-sm transition-colors ${
                    selectedCategory === ""
                      ? "bg-primary-50 text-primary-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`block w-full text-left px-2 py-1.5 text-sm rounded-sm transition-colors ${
                      selectedCategory === category
                        ? "bg-primary-50 text-primary-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Mobile Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4 lg:hidden">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="input sm:w-48"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Results Header */}
          <div className="card p-3 mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{products.length}</span> of{" "}
              <span className="font-medium">{pagination.total}</span> results
              {selectedCategory && (
                <span className="ml-1">
                  in <span className="font-medium text-primary-600">{selectedCategory}</span>
                </span>
              )}
            </p>
            <div className="hidden lg:block">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search in results..."
                  className="input pl-10 w-64 py-1.5"
                />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="card p-20 flex flex-col items-center justify-center">
              <SpinnerIcon className="w-10 h-10 text-primary-500" />
              <p className="mt-4 text-gray-500 text-sm">Loading products...</p>
            </div>
          ) : error ? (
            <div className="card p-20 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button onClick={loadProducts} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="card p-20 text-center">
              <p className="text-gray-500 mb-4">No products found</p>
              {(search || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearch("")
                    setSelectedCategory("")
                  }}
                  className="btn btn-outline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <Pagination currentPage={page} totalPages={pagination.pages} onPageChange={setPage} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default HomePage
