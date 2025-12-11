"use client"

import { MenuIcon } from "../Icons"

function Header({ onMenuClick }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-30">
      <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900">
        <MenuIcon className="w-6 h-6" />
      </button>
      <div className="flex-1" />
      <p className="text-sm text-gray-500">{new Date().toLocaleDateString("en-US", { dateStyle: "full" })}</p>
    </header>
  )
}

export default Header
