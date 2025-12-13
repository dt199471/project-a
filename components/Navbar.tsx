"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { data: session, status } = useSession()
  const router = useRouter()

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
              {session && (
                <>
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
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="text-gray-400 text-sm">...</div>
            ) : session ? (
              <>
                <span className="text-gray-600 text-sm hidden sm:block">{session.user?.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 rounded-md text-sm font-medium transition-colors"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}



