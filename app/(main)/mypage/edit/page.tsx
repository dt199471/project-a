"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function EditProfilePage() {
  const { user, loading: authLoading, updateUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    image: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        image: user.image || "",
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        updateUser(updatedUser)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const error = await response.json()
        setError(error.error || "更新に失敗しました")
      }
    } catch {
      setError("更新に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-light">プロフィール編集</h1>
            <Link
              href="/mypage"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              ← マイページに戻る
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* プロフィール画像 */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">プロフィール画像</h2>
            <div className="flex items-center gap-6">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="プロフィール"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <div>
                <label className="block">
                  <span className="px-4 py-2 bg-gray-900 text-white text-sm font-medium cursor-pointer hover:bg-gray-800 transition-colors inline-block">
                    画像を選択
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG, GIF形式（最大5MB）
                </p>
              </div>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">基本情報</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  ログインID
                </label>
                <input
                  type="text"
                  value={user.loginId}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ログインIDは変更できません
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  表示名
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="例: 山田太郎"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  メールアドレス
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="例: yamada@example.com"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  電話番号
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="例: 090-1234-5678"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 自己紹介 */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">自己紹介</h2>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={5}
              placeholder="自己紹介を入力してください..."
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors resize-none"
            />
          </div>

          {/* エラー/成功メッセージ */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm">
              プロフィールを更新しました
            </div>
          )}

          {/* 送信ボタン */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "更新中..." : "保存する"}
            </button>
            <Link
              href="/mypage"
              className="px-8 py-4 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors text-center"
            >
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}


