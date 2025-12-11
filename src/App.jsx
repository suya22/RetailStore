"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import { SpinnerIcon } from "./components/Icons"

// Storefront Components
import StorefrontLayout from "./components/storefront/Layout"
import HomePage from "./pages/storefront/HomePage"
import ProductDetailPage from "./pages/storefront/ProductDetailPage"
import CartPage from "./pages/storefront/CartPage"
import CheckoutPage from "./pages/storefront/CheckoutPage"
import OrderSuccessPage from "./pages/storefront/OrderSuccessPage"

// Admin Components
import AdminLayout from "./components/admin/Layout"
import LoginPage from "./pages/admin/LoginPage"
import DashboardPage from "./pages/admin/DashboardPage"
import ProductsPage from "./pages/admin/ProductsPage"
import ProductFormPage from "./pages/admin/ProductFormPage"
import OrdersPage from "./pages/admin/OrdersPage"
import OrderDetailPage from "./pages/admin/OrderDetailPage"

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinnerIcon className="w-8 h-8 text-primary-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      {/* Storefront Routes */}
      <Route path="/" element={<StorefrontLayout />}>
        <Route index element={<HomePage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-success/:orderId" element={<OrderSuccessPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id/edit" element={<ProductFormPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App
