"use client"

import { useState } from "react"

interface PropertyMessageFormProps {
  propertyId: string
  receiverId: string
}

export default function PropertyMessageForm({
  propertyId,
  receiverId,
}: PropertyMessageFormProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

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

  return (
    <div className="border-t pt-4">
      <h2 className="text-lg font-semibold mb-4">メッセージを送信</h2>
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          メッセージを送信しました
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="メッセージを入力してください"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          required
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "送信中..." : "送信"}
        </button>
      </form>
    </div>
  )
}




