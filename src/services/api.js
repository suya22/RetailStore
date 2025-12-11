const API_BASE = "/api"

// ==================== Public API (Storefront) ====================

export async function fetchProducts(params = {}) {
  const searchParams = new URLSearchParams()

  if (params.search) searchParams.set("search", params.search)
  if (params.category) searchParams.set("category", params.category)
  if (params.page) searchParams.set("page", params.page)
  if (params.limit) searchParams.set("limit", params.limit)

  const response = await fetch(`${API_BASE}/products?${searchParams}`)
  if (!response.ok) throw new Error("Failed to fetch products")
  return response.json()
}

export async function fetchProduct(id) {
  const response = await fetch(`${API_BASE}/products/${id}`)
  if (!response.ok) throw new Error("Failed to fetch product")
  return response.json()
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE}/products/categories`)
  if (!response.ok) throw new Error("Failed to fetch categories")
  return response.json()
}

export async function createOrder(orderData) {
  const response = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to create order")
  }

  return data
}

export async function fetchOrder(id) {
  const response = await fetch(`${API_BASE}/orders/${id}`)
  if (!response.ok) throw new Error("Failed to fetch order")
  return response.json()
}

// ==================== Admin API ====================

const getToken = () => localStorage.getItem("adminToken")

const authFetch = async (url, options = {}) => {
  const token = getToken()
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(url, { ...options, headers })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Request failed")
  }

  return data
}

// Dashboard
export async function fetchDashboardStats() {
  return authFetch(`${API_BASE}/admin/dashboard`)
}

export async function fetchLowStockProducts(threshold = 10) {
  return authFetch(`${API_BASE}/admin/products/low-stock?threshold=${threshold}`)
}

// Products
export async function fetchAdminProducts(params = {}) {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set("search", params.search)
  if (params.status) searchParams.set("status", params.status)
  if (params.category) searchParams.set("category", params.category)
  if (params.page) searchParams.set("page", params.page)
  if (params.limit) searchParams.set("limit", params.limit)

  return authFetch(`${API_BASE}/admin/products?${searchParams}`)
}

export async function fetchAdminProduct(id) {
  return authFetch(`${API_BASE}/admin/products/${id}`)
}

export async function createProduct(productData) {
  const formData = new FormData()

  Object.keys(productData).forEach((key) => {
    if (key === "image" && productData[key]) {
      formData.append("image", productData[key])
    } else if (productData[key] !== undefined && productData[key] !== null) {
      formData.append(key, productData[key])
    }
  })

  return authFetch(`${API_BASE}/admin/products`, {
    method: "POST",
    body: formData,
  })
}

export async function updateProduct(id, productData) {
  const formData = new FormData()

  Object.keys(productData).forEach((key) => {
    if (key === "image" && productData[key]) {
      formData.append("image", productData[key])
    } else if (productData[key] !== undefined && productData[key] !== null) {
      formData.append(key, productData[key])
    }
  })

  return authFetch(`${API_BASE}/admin/products/${id}`, {
    method: "PUT",
    body: formData,
  })
}

export async function toggleProductStatus(id) {
  return authFetch(`${API_BASE}/admin/products/${id}/toggle-status`, {
    method: "PATCH",
  })
}

// Orders
export async function fetchAdminOrders(params = {}) {
  const searchParams = new URLSearchParams()
  if (params.status) searchParams.set("status", params.status)
  if (params.startDate) searchParams.set("startDate", params.startDate)
  if (params.endDate) searchParams.set("endDate", params.endDate)
  if (params.page) searchParams.set("page", params.page)
  if (params.limit) searchParams.set("limit", params.limit)

  return authFetch(`${API_BASE}/admin/orders?${searchParams}`)
}

export async function fetchAdminOrder(id) {
  return authFetch(`${API_BASE}/admin/orders/${id}`)
}

export async function updateOrderStatus(id, status) {
  return authFetch(`${API_BASE}/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}
