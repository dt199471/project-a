"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, loading } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-light text-gray-900 tracking-wide">
              Selfie Home
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
              {!loading && (
                user ? (
                  <Link
                    href="/mypage"
                    className="flex items-center gap-2 text-sm text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-light">{user.name || user.loginId}</span>
                  </Link>
                ) : (
                  <Link
                    href="/auth"
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    ログイン
                  </Link>
                )
              )}
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
              <div className="pt-4 border-t border-gray-200">
                {!loading && (
                  user ? (
                    <Link
                      href="/mypage"
                      className="flex items-center gap-2 text-sm text-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-light">{user.name || user.loginId}</span>
                    </Link>
                  ) : (
                    <Link
                      href="/auth"
                      className="block text-center py-2 bg-gray-900 text-white text-sm font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ログイン
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
