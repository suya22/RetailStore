"use client"

import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { DashboardIcon, PackageIcon, ClipboardListIcon, LogoutIcon, XIcon, StoreIcon } from "../Icons"

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: DashboardIcon },
  { path: "/admin/products", label: "Products", icon: PackageIcon },
  { path: "/admin/orders", label: "Orders", icon: ClipboardListIcon },
]

function Sidebar({ open, onClose }) {
  const { logout, admin } = useAuth()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
            <span className="text-xl font-bold text-white">RetailHub Admin</span>
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path)
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive ? "bg-primary-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              )
            })}

            <NavLink
              to="/"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <StoreIcon className="w-5 h-5" />
              View Storefront
            </NavLink>
          </nav>

          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                {admin?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{admin?.email}</p>
                <p className="text-xs text-slate-400 capitalize">{admin?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LogoutIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
