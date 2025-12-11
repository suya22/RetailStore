"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { fetchDashboardStats, fetchLowStockProducts } from "../../services/api"
import StatusBadge from "../../components/admin/StatusBadge"
import { SpinnerIcon, ShoppingBagIcon, CurrencyDollarIcon, PackageIcon, ExclamationIcon } from "../../components/Icons"

function StatCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}

function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [statsData, lowStockData] = await Promise.all([fetchDashboardStats(), fetchLowStockProducts()])
        setStats(statsData.data)
        setLowStock(lowStockData.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <SpinnerIcon className="w-8 h-8 text-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Today's Orders" value={stats.todayOrders} icon={ShoppingBagIcon} color="bg-blue-500" />
        <StatCard
          title="Today's Revenue"
          value={`$${stats.todayRevenue.toFixed(2)}`}
          icon={CurrencyDollarIcon}
          color="bg-green-500"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={PackageIcon}
          color="bg-purple-500"
          subtitle={`${stats.lowStockCount} low stock`}
        />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBagIcon} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {["New", "Processing", "Shipped", "Cancelled"].map((status) => (
              <div key={status} className="flex items-center justify-between">
                <StatusBadge status={status} />
                <span className="font-semibold text-gray-900">{stats.ordersByStatus[status] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
            <Link to="/admin/products" className="text-primary-600 text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No low stock products</p>
          ) : (
            <div className="space-y-3">
              {lowStock.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ExclamationIcon className="w-5 h-5 text-amber-500" />
                    <span className="text-gray-700 truncate max-w-[200px]">{product.name}</span>
                  </div>
                  <span className="text-sm font-medium text-red-600">{product.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
