"use client"

import { useState, useRef, useEffect } from "react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "こんにちは！不動産に関するご質問にお答えします。物件探しや売却についてお気軽にご相談ください。",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // モックの応答パターン
  const getMockResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // 価格関連
    if (lowerMessage.includes("価格") || lowerMessage.includes("相場") || lowerMessage.includes("いくら")) {
      return "物件の価格相場についてですね。エリアや築年数、専有面積などによって大きく変わります。AI価格査定機能を使うと、より正確な価格帯が分かりますよ！"
    }

    // エリア関連
    if (lowerMessage.includes("エリア") || lowerMessage.includes("地域") || lowerMessage.includes("どこ")) {
      return "エリア選びは重要ですね。通勤・通学の利便性、周辺施設、将来の資産価値などを考慮することをおすすめします。具体的な地域についてお探しですか？"
    }

    // 購入関連
    if (lowerMessage.includes("購入") || lowerMessage.includes("買う") || lowerMessage.includes("買いたい")) {
      return "物件購入についてですね。まずは物件検索ページで条件に合う物件を探してみてください。気になる物件があれば、売主に直接メッセージで質問することもできます。"
    }

    // 売却関連
    if (lowerMessage.includes("売却") || lowerMessage.includes("売る") || lowerMessage.includes("売りたい")) {
      return "物件の売却をお考えですか。物件登録ページから簡単に出品できます。AI価格査定で適正価格を確認してから出品すると、スムーズに取引できますよ。"
    }

    // メッセージ関連
    if (lowerMessage.includes("メッセージ") || lowerMessage.includes("問い合わせ") || lowerMessage.includes("連絡")) {
      return "物件詳細ページから売主に直接メッセージを送ることができます。気になることがあれば、遠慮なく質問してみてください！"
    }

    // お気に入り関連
    if (lowerMessage.includes("お気に入り") || lowerMessage.includes("保存")) {
      return "気になる物件は「お気に入り」に追加できます。物件詳細ページの❤️ボタンをクリックするだけです。お気に入り一覧からいつでも確認できますよ。"
    }

    // 挨拶
    if (lowerMessage.includes("こんにちは") || lowerMessage.includes("はじめまして") || lowerMessage.includes("hello")) {
      return "こんにちは！何かお手伝いできることがあれば、お気軽にお聞きください。物件探しや売却に関する質問にお答えします。"
    }

    // ありがとう
    if (lowerMessage.includes("ありがとう") || lowerMessage.includes("感謝") || lowerMessage.includes("thanks")) {
      return "どういたしまして！他にも何か質問があれば、いつでもお聞きください。"
    }

    // デフォルト応答
    return "ご質問ありがとうございます。具体的な内容についてもう少し詳しく教えていただけますか？物件の購入・売却、エリア、価格など、どんなことでもお答えします！"
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // モック実装: AIの応答をシミュレート
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getMockResponse(input),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* チャットボットトグルボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group"
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {messages.length > 1 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {messages.filter((m) => m.role === "assistant").length - 1}
              </span>
            )}
          </>
        )}
      </button>

      {/* チャットウィンドウ */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">AIアシスタント</h3>
                <p className="text-xs text-white/80">不動産のご相談にお答えします</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* モック警告 */}
          <div className="bg-yellow-50 border-b border-yellow-200 p-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-yellow-800">
                これはモック機能です。実際のAIは未実装で、予め設定された応答パターンを返します。
              </p>
            </div>
          </div>

          {/* メッセージエリア */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                      : "bg-white text-gray-800 shadow-sm border border-gray-200"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user" ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("ja-JP", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="メッセージを入力..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
