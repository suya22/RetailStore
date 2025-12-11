"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import { ShoppingCartIcon, SearchIcon, UserIcon } from "../Icons"

function Header() {
  const { itemCount } = useCart()
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="bg-primary-500 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white italic">RetailHub</span>
              <span className="text-[10px] text-yellow-300 italic -mt-1">
                Explore <span className="text-yellow-400">Plus</span>
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden sm:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more"
                className="w-full py-2 pl-4 pr-12 rounded-sm text-sm focus:outline bg-white"
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-primary-600 hover:bg-primary-700 transition-colors rounded-r-sm">
                <SearchIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              to="/admin"
              className="hidden md:flex items-center gap-2 text-white hover:text-yellow-300 transition-colors font-medium"
            >
              <UserIcon className="w-5 h-5" />
              <span>Admin</span>
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors font-medium relative"
              aria-label="Shopping cart"
            >
              <div className="relative">
                <ShoppingCartIcon className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-[10px] font-bold rounded-sm w-5 h-4 flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Cart</span>
            </Link>
          </nav>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full py-2 pl-4 pr-12 rounded-sm text-sm focus:outline-none"
            />
            <button className="absolute right-0 top-0 h-full px-4 bg-primary-600">
              <SearchIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
