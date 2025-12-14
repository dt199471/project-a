"use client"

import Link from "next/link"
import { useState } from "react"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-light text-gray-900 tracking-wide">
              URUCAMO
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <Link
                href="/properties"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wide"
              >
                購入
              </Link>
              <Link
                href="/properties/new"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wide"
              >
                売却
              </Link>
              <Link
                href="/ai-estimator"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wide"
              >
                AI査定
              </Link>
              <Link
                href="/messages"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wide"
              >
                メッセージ
              </Link>
              <Link
                href="/favorites"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wide"
              >
                お気に入り
              </Link>
            </div>
            <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
              <a
                href="tel:0120-962-658"
                className="flex items-center gap-2 text-sm text-gray-900 hover:text-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-light">0120-962-658</span>
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                href="/properties"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light"
                onClick={() => setMobileMenuOpen(false)}
              >
                購入
              </Link>
              <Link
                href="/properties/new"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light"
                onClick={() => setMobileMenuOpen(false)}
              >
                売却
              </Link>
              <Link
                href="/ai-estimator"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI査定
              </Link>
              <Link
                href="/messages"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light"
                onClick={() => setMobileMenuOpen(false)}
              >
                メッセージ
              </Link>
              <Link
                href="/favorites"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light"
                onClick={() => setMobileMenuOpen(false)}
              >
                お気に入り
              </Link>
              <a
                href="tel:0120-962-658"
                className="flex items-center gap-2 text-sm text-gray-900 pt-4 border-t border-gray-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-light">0120-962-658</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
