"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface Property {
  id: string
  title: string
  price: number
  address: string
  city: string
  prefecture: string
  status: string
  createdAt: string
  images: string
  userId: string
  _count?: {
    messages: number
    favorites: number
  }
}

export default function BusinessSellPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "properties" | "new">("overview")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      fetchProperties()
    }
  }, [user])

  const fetchProperties = async () => {
    try {
      const res = await fetch(`/api/properties?limit=100`)
      if (res.ok) {
        const data = await res.json()
        // APIは { properties: [...], pagination: {...} } を返す
        const allProperties = data.properties || []
        // 自分の物件のみフィルタリング
        const myProperties = allProperties.filter((p: any) => p.userId === user?.id)
        setProperties(myProperties)
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setDataLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP").format(price)
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ACTIVE: "公開中",
      NEGOTIATING: "交渉中",
      SOLD: "成約済",
      DRAFT: "下書き",
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-800",
      NEGOTIATING: "bg-yellow-100 text-yellow-800",
      SOLD: "bg-gray-100 text-gray-800",
      DRAFT: "bg-blue-100 text-blue-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const propertyList = Array.isArray(properties) ? properties : []
  const stats = {
    total: propertyList.length,
    active: propertyList.filter((p) => p.status === "ACTIVE").length,
    negotiating: propertyList.filter((p) => p.status === "NEGOTIATING").length,
    sold: propertyList.filter((p) => p.status === "SOLD").length,
    totalFavorites: propertyList.reduce((sum, p) => sum + (p._count?.favorites || 0), 0),
    totalMessages: propertyList.reduce((sum, p) => sum + (p._count?.messages || 0), 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-white/10 text-sm">
              業者様向け
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-light mb-4">
            物件管理ダッシュボード
          </h1>
          <p className="text-gray-400">
            自社物件の登録・管理を一括で行えます
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview" as const, label: "概要" },
              { id: "properties" as const, label: "物件一覧" },
              { id: "new" as const, label: "新規登録" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 p-6">
                <div className="text-sm text-gray-500">登録物件数</div>
                <div className="text-3xl font-light text-gray-900 mt-2">{stats.total}</div>
              </div>
              <div className="bg-white border border-gray-200 p-6">
                <div className="text-sm text-gray-500">公開中</div>
                <div className="text-3xl font-light text-green-600 mt-2">{stats.active}</div>
              </div>
              <div className="bg-white border border-gray-200 p-6">
                <div className="text-sm text-gray-500">交渉中</div>
                <div className="text-3xl font-light text-yellow-600 mt-2">{stats.negotiating}</div>
              </div>
              <div className="bg-white border border-gray-200 p-6">
                <div className="text-sm text-gray-500">成約済</div>
                <div className="text-3xl font-light text-gray-600 mt-2">{stats.sold}</div>
              </div>
            </div>

            {/* Engagement Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500">お気に入り登録数</div>
                    <div className="text-2xl font-light text-gray-900">{stats.totalFavorites}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500">お問い合わせ数</div>
                    <div className="text-2xl font-light text-gray-900">{stats.totalMessages}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">クイックアクション</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setActiveTab("new")}
                  className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  新規物件を登録
                </button>
                <Link
                  href="/ai-estimator"
                  className="px-6 py-3 border border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  AI価格査定
                </Link>
                <Link
                  href="/messages"
                  className="px-6 py-3 border border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  メッセージを確認
                </Link>
              </div>
            </div>

            {/* Recent Properties */}
            {propertyList.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">最近の物件</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {propertyList.slice(0, 3).map((property) => {
                    const images = JSON.parse(property.images || "[]")
                    return (
                      <Link
                        key={property.id}
                        href={`/properties/${property.id}`}
                        className="border border-gray-200 hover:border-gray-400 transition-colors"
                      >
                        <div className="aspect-video bg-gray-100 relative">
                          {images[0] ? (
                            <img
                              src={images[0]}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                          <div className={`absolute top-2 left-2 px-2 py-1 text-xs ${getStatusColor(property.status)}`}>
                            {getStatusLabel(property.status)}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900 truncate">{property.title}</h3>
                          <p className="text-lg text-gray-900 mt-1">¥{formatPrice(property.price)}</p>
                          <p className="text-sm text-gray-500">{property.prefecture} {property.city}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <div>
            {dataLoading ? (
              <div className="text-center py-12 text-gray-500">読み込み中...</div>
            ) : propertyList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">登録物件がありません</p>
                <button
                  onClick={() => setActiveTab("new")}
                  className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  物件を登録する
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          物件
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          価格
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ステータス
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          反響
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {propertyList.map((property) => {
                        const images = JSON.parse(property.images || "[]")
                        return (
                          <tr key={property.id}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-12 bg-gray-100 flex-shrink-0">
                                  {images[0] ? (
                                    <img
                                      src={images[0]}
                                      alt={property.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                      No Image
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{property.title}</div>
                                  <div className="text-sm text-gray-500">{property.prefecture} {property.city}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ¥{formatPrice(property.price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs ${getStatusColor(property.status)}`}>
                                {getStatusLabel(property.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-4">
                                <span title="お気に入り">
                                  <svg className="w-4 h-4 inline mr-1 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                  </svg>
                                  {property._count?.favorites || 0}
                                </span>
                                <span title="メッセージ">
                                  <svg className="w-4 h-4 inline mr-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  {property._count?.messages || 0}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-3">
                                <Link
                                  href={`/properties/${property.id}`}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  詳細
                                </Link>
                                <Link
                                  href={`/properties/${property.id}/edit`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  編集
                                </Link>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* New Property Tab */}
        {activeTab === "new" && (
          <div>
            <div className="bg-gray-50 border border-gray-200 p-8 text-center">
              <h2 className="text-xl font-medium text-gray-900 mb-4">新規物件を登録</h2>
              <p className="text-gray-600 mb-6">
                物件情報を入力して公開しましょう。写真や詳細情報を充実させることで、より多くの購入希望者の目に留まりやすくなります。
              </p>
              <Link
                href="/properties/new"
                className="inline-block px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                物件登録フォームへ
              </Link>
            </div>

            {/* Tips */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 p-6">
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">高品質な写真</h3>
                <p className="text-sm text-gray-600">
                  明るく清潔感のある写真を10枚以上登録すると、問い合わせ率が向上します。
                </p>
              </div>
              <div className="border border-gray-200 p-6">
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">詳細な情報</h3>
                <p className="text-sm text-gray-600">
                  物件の特徴やアピールポイントを具体的に記載しましょう。
                </p>
              </div>
              <div className="border border-gray-200 p-6">
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">適正価格</h3>
                <p className="text-sm text-gray-600">
                  AI査定を活用して、市場に合った適正価格を設定しましょう。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
