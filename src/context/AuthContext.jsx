"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

const API_BASE = "/api"

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (token) {
      fetchCurrentAdmin(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCurrentAdmin = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAdmin({ ...data.data, token })
      } else {
        localStorage.removeItem("adminToken")
      }
    } catch (error) {
      console.error("Failed to fetch admin:", error)
      localStorage.removeItem("adminToken")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }

    localStorage.setItem("adminToken", data.data.token)
    setAdmin(data.data)
    return data.data
  }

  const logout = async () => {
    const token = localStorage.getItem("adminToken")
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
    localStorage.removeItem("adminToken")
    setAdmin(null)
  }

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken")
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        loading,
        login,
        logout,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
