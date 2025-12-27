"use client"

import { useState } from "react"

interface Message {
  id: string
  content: string
  sender: { name: string | null }
}

interface MessageFormProps {
  propertyId: string
  receiverId: string
  onMessageSent: () => void
  messages?: Message[]
  propertyTitle?: string
  isSeller?: boolean
}

export default function MessageForm({
  propertyId,
  receiverId,
  onMessageSent,
  messages = [],
  propertyTitle = "",
  isSeller = false,
}: MessageFormProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

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

  // AI返信案を取得
  const handleGetSuggestions = async () => {
    if (messages.length === 0) {
      alert("メッセージ履歴がありません")
      return
    }

    setAiLoading(true)
    setShowSuggestions(false)
    try {
      const response = await fetch("/api/ai/reply-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          propertyTitle,
          isSeller,
        }),
      })

      const result = await response.json()

      if (result.success && result.suggestions) {
        // 返信案を分割（番号付きリストを想定）
        const parsed = result.suggestions
          .split(/\n(?=\d\.)/)
          .map((s: string) => s.replace(/^\d\.\s*/, "").trim())
          .filter((s: string) => s.length > 0)
        setSuggestions(parsed.length > 0 ? parsed : [result.suggestions])
        setShowSuggestions(true)
      } else {
        alert(result.error || "返信案を生成できませんでした")
      }
    } catch (error) {
      console.error("AI suggest error:", error)
      alert("返信案の生成中にエラーが発生しました")
    } finally {
      setAiLoading(false)
    }
  }

  // 返信案を選択
  const selectSuggestion = (suggestion: string) => {
    setContent(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-3">
      {/* AI返信案表示 */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-800">AI返信案（クリックで選択）</span>
            <button
              type="button"
              onClick={() => setShowSuggestions(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectSuggestion(suggestion)}
                className="w-full text-left p-2 bg-white border border-blue-200 rounded text-sm text-gray-700 hover:bg-blue-100 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <button
          type="button"
          onClick={handleGetSuggestions}
          disabled={aiLoading || messages.length === 0}
          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          title="AI返信案を生成"
        >
          {aiLoading ? (
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
        </button>
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
    </div>
  )
}







