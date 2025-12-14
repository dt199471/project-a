"use client"

import { useState } from "react"

interface MessageFormProps {
  propertyId: string
  receiverId: string
  onMessageSent: () => void
}

export default function MessageForm({
  propertyId,
  receiverId,
  onMessageSent,
}: MessageFormProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          receiverId,
          content,
        }),
      })

      if (response.ok) {
        setContent("")
        onMessageSent()
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

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="メッセージを入力..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "送信中..." : "送信"}
      </button>
    </form>
  )
}




