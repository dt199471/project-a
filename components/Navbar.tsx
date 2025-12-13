"use client"

import Link from "next/link"

export default function Navbar() {

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="cowcamo-container">
        <div className="col-span-full flex justify-between items-center h-16 lg:h-20">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              URUCAMO
            </Link>
            <div className="ml-8 hidden lg:flex items-center space-x-6">
              <Link
                href="/properties"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                物件を探す
              </Link>
              <Link
                href="/properties/new"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                物件を売る
              </Link>
              <Link
                href="/messages"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                メッセージ
              </Link>
              <Link
                href="/favorites"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                お気に入り
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
          </div>
        </div>
      </div>
    </nav>
  )
}



