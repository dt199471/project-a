"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

interface Conversation {
  property: {
    id: string
    title: string
  }
  otherUser: {
    id: string
    name: string | null
    image: string | null
  }
  lastMessage: {
    id: string
    content: string
    createdAt: string
    senderId: string
  }
  unreadCount: number
}

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchConversations()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user?.id, authLoading])

  const fetchConversations = async () => {
    if (!user?.id) return
    
    try {
      const response = await fetch(`/api/messages?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">メッセージ</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 mb-4">メッセージを表示するにはログインが必要です</p>
            <Link href="/auth" className="text-gray-900 underline hover:no-underline">
              ログインはこちら
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">メッセージ</h1>
        {conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">メッセージはありません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv, index) => {
              // nullチェック
              if (!conv.property || !conv.otherUser) return null
              
              return (
                <Link
                  key={index}
                  href={`/messages/${conv.property.id}/${conv.otherUser.id}`}
                >
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start space-x-4">
                    {conv.otherUser.image && (
                      <img
                        src={conv.otherUser.image}
                        alt={conv.otherUser.name || "User"}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {conv.otherUser.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {conv.property.title}
                          </p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 line-clamp-2">
                        {conv.lastMessage.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(conv.lastMessage.createdAt).toLocaleString(
                          "ja-JP"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}




