"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [loginId, setLoginId] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (mode === "login") {
        const result = await login(loginId)
        if (result.success) {
          router.push("/mypage")
        } else {
          setError(result.error || "ログインに失敗しました")
        }
      } else {
        const result = await register(loginId, name || undefined)
        if (result.success) {
          router.push("/mypage")
        } else {
          setError(result.error || "登録に失敗しました")
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Selfie Home
          </h1>
          <p className="text-gray-600 text-sm">
            {mode === "login" ? "ログイン" : "新規登録"}
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-8">
          {/* タブ切り替え */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                mode === "login"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              ログイン
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                mode === "register"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              新規登録
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                ログインID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="例: yamada123"
                required
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                半角英数字で入力してください
              </p>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  表示名
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例: 山田太郎"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !loginId}
              className="w-full py-4 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "処理中..."
                : mode === "login"
                ? "ログイン"
                : "登録する"}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            {mode === "login"
              ? "アカウントをお持ちでない方は「新規登録」タブから登録してください"
              : "既にアカウントをお持ちの方は「ログイン」タブからログインしてください"}
          </p>
        </div>
      </div>
    </div>
  )
}

