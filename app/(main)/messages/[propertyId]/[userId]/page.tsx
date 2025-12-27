"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import MessageForm from "@/components/messaging/MessageForm"

interface Message {
  id: string
  content: string
  createdAt: string
  senderId: string
  sender: {
    id: string
    name: string | null
    image: string | null
  }
  receiver: {
    id: string
    name: string | null
    image: string | null
  }
  property: {
    id: string
    title: string
  }
}

export default function ConversationPage() {
  const params = useParams()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.propertyId && params.userId) {
      fetchMessages()
    }
  }, [params.propertyId, params.userId])

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/messages?propertyId=${params.propertyId}&conversationWith=${params.userId}`
      )
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMessageSent = () => {
    fetchMessages()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="mb-4 text-indigo-600 hover:text-indigo-700"
        >
          ← 戻る
        </button>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {messages[0]?.property.title}
          </h1>
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                メッセージはありません
              </p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className="flex justify-start"
                >
                  <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-200 text-gray-900">
                    <p className="text-xs font-semibold mb-1">
                      {message.sender.name}
                    </p>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 text-gray-500">
                      {new Date(message.createdAt).toLocaleString("ja-JP")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <MessageForm
            propertyId={params.propertyId as string}
            receiverId={params.userId as string}
            onMessageSent={handleMessageSent}
            messages={messages}
            propertyTitle={messages[0]?.property.title}
            isSeller={true}
          />
        </div>
      </div>
    </div>
  )
}







