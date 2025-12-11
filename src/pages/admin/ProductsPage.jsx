"use client"

import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { fetchAdminProducts, toggleProductStatus, fetchCategories } from "../../services/api"
import StatusBadge from "../../components/admin/StatusBadge"
import Pagination from "../../components/Pagination"
import { SpinnerIcon, PlusIcon, PencilIcon, SearchIcon } from "../../components/Icons"

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [togglingId, setTogglingId] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data.data))
      .catch((err) => console.error("Failed to load categories:", err))
  }, [])

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchAdminProducts({
        search: debouncedSearch,
        status: statusFilter,
        category: categoryFilter,
        page,
        limit: 10,
      })
      setProducts(data.data)
      setPagination(data.pagination)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, statusFilter, categoryFilter, page])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleToggleStatus = async (productId) => {
    try {
      setTogglingId(productId)
      await toggleProductStatus(productId)
      loadProducts()
    } catch (err) {
      alert(err.message)
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link to="/admin/products/new" className="btn btn-primary">
          <PlusIcon className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input pl-10"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="select">
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <SpinnerIcon className="w-8 h-8 text-primary-600" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={loadProducts} className="btn btn-primary">
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => {
                  const imageUrl = product.imageUrl
                    ? product.imageUrl.startsWith("/")
                      ? product.imageUrl
                      : `/uploads/${product.imageUrl}`
                    : null

                  return (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {imageUrl ? (
                              <img
                                src={imageUrl || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No image
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${product.stock <= 10 ? "text-red-600" : "text-gray-900"}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={product.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="btn btn-outline btn-sm"
                            aria-label={`Edit ${product.name}`}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(product._id)}
                            disabled={togglingId === product._id}
                            className={`btn btn-sm ${product.status === "Active" ? "btn-secondary" : "btn-primary"}`}
                          >
                            {togglingId === product._id ? (
                              <SpinnerIcon className="w-4 h-4" />
                            ) : product.status === "Active" ? (
                              "Deactivate"
                            ) : (
                              "Activate"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination currentPage={page} totalPages={pagination.pages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
