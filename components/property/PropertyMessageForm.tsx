"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

interface PropertyMessageFormProps {
  propertyId: string
  receiverId: string
}

export default function PropertyMessageForm({
  propertyId,
  receiverId,
}: PropertyMessageFormProps) {
  const { user, loading: authLoading } = useAuth()
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !user?.id) return

    setLoading(true)
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          receiverId,
          senderId: user.id,
          content,
        }),
      })

      if (response.ok) {
        setContent("")
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const error = await response.json()
        alert(error.error || "メッセージの送信に失敗しました")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      alert("メッセージの送信に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return null

  // 自分の物件には表示しない
  if (user?.id === receiverId) {
    return null
  }

  if (!user) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">出品者に連絡する</h2>
        <p className="text-sm text-gray-600 mb-4">
          メッセージを送信するにはログインが必要です
        </p>
        <Link
          href="/auth"
          className="inline-block px-6 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          ログインする
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">出品者に連絡する</h2>
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm">
          メッセージを送信しました
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="メッセージを入力してください..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors resize-none mb-4"
          required
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "送信中..." : "メッセージを送信"}
        </button>
      </form>
    </div>
  )
}
