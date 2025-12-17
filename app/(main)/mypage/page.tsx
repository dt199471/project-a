"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

interface Property {
  id: string
  title: string
  price: number
  images: string
  status: string
  createdAt: string
  prefecture?: string
  city?: string
  address?: string
  buildYear?: number | null
  buildMonth?: number | null
  layout?: string | null
  area?: number | null
  description?: string
  favoriteCount?: number
  messageCount?: number
  lastMessage?: {
    id: string
    content: string
    createdAt: string
    sender: { id: string; name: string | null; image: string | null }
    receiver: { id: string; name: string | null; image: string | null }
  } | null
}

interface UserData {
  id: string
  loginId: string
  name: string | null
  email: string | null
  phone: string | null
  bio: string | null
  image: string | null
  properties: Property[]
  _count: {
    properties: number
    favorites: number
  }
  createdAt: string
}

interface FavoriteProperty {
  id: string
  property: {
    id: string
    title: string
    price: number
    images: string
    prefecture: string
    city: string
    buildYear?: number | null
    buildMonth?: number | null
    layout?: string | null
    area?: number | null
    status: string
  }
  createdAt: string
}

export default function MyPage() {
  const { user, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [favoriteProperties, setFavoriteProperties] = useState<FavoriteProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [previewProperty, setPreviewProperty] = useState<Property | null>(null)
  const [activeTab, setActiveTab] = useState<"sell" | "buy">("sell")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user?.id) {
      fetchUserData()
      fetchFavoriteProperties()
    }
  }, [user?.id])

  const fetchUserData = async () => {
    if (!user?.id) return
    
    try {
      const response = await fetch(`/api/users/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFavoriteProperties = async () => {
    if (!user?.id) return
    
    try {
      const response = await fetch(`/api/favorites?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b24b0ddd-9846-4da6-bed5-1b28613f60cf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H4',location:'app/(main)/mypage/page.tsx:fetchFavoriteProperties',message:'favorites fetched for mypage',data:{userId:user.id,count:Array.isArray(data)?data.length:null},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        const favoritesWithNumber = data.map((fav: any) => ({
          ...fav,
          property: {
            ...fav.property,
            price: Number(fav.property.price),
          },
        }))
        setFavoriteProperties(favoritesWithNumber)
      }
    } catch (error) {
      console.error("Error fetching favorites:", error)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (authLoading || loading) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <span className="bg-green-500 text-white text-xs font-medium px-2 py-0.5">公開中</span>
      case "NEGOTIATING":
        return <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-0.5">交渉中</span>
      case "SOLD":
        return <span className="bg-gray-500 text-white text-xs font-medium px-2 py-0.5">成約済み</span>
      case "DRAFT":
        return <span className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5">下書き</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-light">マイページ</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* プロフィールカード */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-center mb-6">
                {userData?.image ? (
                  <img
                    src={userData.image}
                    alt={userData.name || "User"}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <h2 className="text-xl font-medium text-gray-900 mt-4">
                  {userData?.name || userData?.loginId}
                </h2>
                <p className="text-sm text-gray-500">@{userData?.loginId}</p>
              </div>

              {userData?.bio && (
                <p className="text-sm text-gray-700 mb-6 whitespace-pre-wrap">
                  {userData.bio}
                </p>
              )}

              <div className="space-y-3 text-sm">
                {userData?.email && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {userData.email}
                  </div>
                )}
                {userData?.phone && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {userData.phone}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-light text-gray-900">{userData?._count.properties || 0}</p>
                  <p className="text-xs text-gray-500">登録物件</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-light text-gray-900">{favoriteProperties.length}</p>
                  <p className="text-xs text-gray-500">お気に入り</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  href="/mypage/edit"
                  className="block w-full py-3 text-center bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  プロフィール編集
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full py-3 text-center border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>

          {/* タブ切り替え */}
          <div className="lg:col-span-2">
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("sell")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "sell"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                売りたい
              </button>
              <button
                onClick={() => setActiveTab("buy")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "buy"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                買いたい
              </button>
            </div>

            {/* 売却検討者向けタブ */}
            {activeTab === "sell" && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">登録物件</h3>
                  <Link
                    href="/properties/new"
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    新規登録
                  </Link>
                </div>

                {userData?.properties && userData.properties.length > 0 ? (
              <div className="space-y-4">
                {userData.properties.map((property) => {
                  const images = property.images ? JSON.parse(property.images) : []
                  const firstImage = images[0]

                  return (
                    <div key={property.id} className="bg-white border border-gray-200 flex overflow-hidden hover:border-gray-400 transition-colors">
                      <div className="w-32 h-24 bg-gray-100 flex-shrink-0">
                        {firstImage ? (
                          <img
                            src={firstImage}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusBadge(property.status)}
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                              {property.title}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {property.price.toLocaleString()}万円
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                              </svg>
                              {property.favoriteCount || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              {property.messageCount || 0}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => setPreviewProperty(property)}
                            className="px-3 py-1.5 text-xs border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            プレビュー
                          </button>
                          <Link
                            href={`/properties/${property.id}`}
                            className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            詳細
                          </Link>
                          <Link
                            href={`/properties/${property.id}/edit`}
                            className="px-3 py-1.5 text-xs bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                          >
                            編集
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 p-12 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-gray-600 mb-4">登録済みの物件がありません</p>
                <Link
                  href="/properties/new"
                  className="inline-block px-6 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  物件を登録する
                </Link>
              </div>
                )}
              </>
            )}

            {/* 購入検討者向けタブ */}
            {activeTab === "buy" && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">お気に入り物件</h3>
                  <span className="text-sm text-gray-500">{favoriteProperties.length}件</span>
                </div>

                {favoriteProperties.length > 0 ? (
                  <div className="space-y-4">
                    {favoriteProperties.map((fav) => {
                      const property = fav.property
                      const images = property.images ? JSON.parse(property.images) : []
                      const firstImage = images[0]

                      return (
                        <div key={fav.id} className="bg-white border border-gray-200 flex overflow-hidden hover:border-gray-400 transition-colors">
                          <div className="w-32 h-24 bg-gray-100 flex-shrink-0">
                            {firstImage ? (
                              <img
                                src={firstImage}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 p-4 flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {getStatusBadge(property.status)}
                                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {property.title}
                                </h4>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                {property.price.toLocaleString()}万円
                              </p>
                              <p className="text-xs text-gray-500">
                                {property.prefecture}{property.city}
                                {property.buildYear && ` / ${property.buildYear}年築`}
                                {property.layout && ` / ${property.layout}`}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Link
                                href={`/properties/${property.id}`}
                                className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                詳細
                              </Link>
                              <button
                                onClick={async () => {
                                  try {
                                    const response = await fetch(
                                      `/api/favorites?propertyId=${property.id}&userId=${user?.id}`,
                                      { method: "DELETE" }
                                    )
                                    if (response.ok) {
                                      fetchFavoriteProperties()
                                    }
                                  } catch (error) {
                                    console.error("Error removing favorite:", error)
                                  }
                                }}
                                className="px-3 py-1.5 text-xs border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                              >
                                削除
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 p-12 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="text-gray-600 mb-4">お気に入り登録がありません</p>
                    <Link
                      href="/properties"
                      className="inline-block px-6 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      物件を探す
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* クイックリンク - タブに応じて変更 */}
            {activeTab === "sell" ? (
              /* 売却検討者向け - 物件ごとのメッセージを表示 */
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">物件への問い合わせ</h3>
                {userData?.properties && userData.properties.filter(p => (p.messageCount || 0) > 0).length > 0 ? (
                  <div className="space-y-3">
                    {userData.properties.filter(p => (p.messageCount || 0) > 0).map((property) => (
                      <Link
                        key={property.id}
                        href={`/messages?propertyId=${property.id}`}
                        className="block p-4 border border-gray-200 hover:border-gray-400 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <div>
                              <span className="text-sm font-medium text-gray-900 line-clamp-1">{property.title}</span>
                              {property.lastMessage && (
                                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                  {property.lastMessage.content}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1">
                            {property.messageCount}件
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border border-gray-200 text-center text-sm text-gray-500">
                    物件への問い合わせはありません
                  </div>
                )}
              </div>
            ) : (
              /* 購入検討者向け - お気に入りとメッセージ */
              <div className="grid grid-cols-2 gap-4 mt-8">
                <Link
                  href="/favorites"
                  className="p-4 border border-gray-200 hover:border-gray-400 transition-colors"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">お気に入り一覧</span>
                  </div>
                </Link>
                <Link
                  href="/messages"
                  className="p-4 border border-gray-200 hover:border-gray-400 transition-colors"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">メッセージ</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* プレビューモーダル */}
      {previewProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* モーダルヘッダー */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-medium mb-1">掲載プレビュー</p>
                <h2 className="text-lg font-medium text-gray-900">実際の表示イメージ</h2>
              </div>
              <button
                onClick={() => setPreviewProperty(null)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* プレビューコンテンツ */}
            <div className="p-6">
              {/* カード形式プレビュー */}
              <div className="mb-8">
                <p className="text-sm text-gray-500 mb-3">■ 物件一覧での表示</p>
                <div className="max-w-sm bg-white border border-gray-200 shadow-md overflow-hidden">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {(() => {
                      const images = previewProperty.images ? JSON.parse(previewProperty.images) : []
                      const firstImage = images[0]
                      return firstImage ? (
                        <img
                          src={firstImage}
                          alt={previewProperty.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )
                    })()}
                    <div className="absolute top-3 left-3">
                      {getStatusBadge(previewProperty.status)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                      {previewProperty.title || "（物件名未設定）"}
                    </h3>
                    <p className="text-lg font-light text-gray-900 mb-2">
                      {previewProperty.price ? `${previewProperty.price.toLocaleString()}万円` : "価格未設定"}
                    </p>
                    {previewProperty.buildYear && (
                      <p className="text-xs text-gray-600 mb-1">
                        {previewProperty.buildYear}年{previewProperty.buildMonth ? `${previewProperty.buildMonth}月` : ''}築
                      </p>
                    )}
                    {(previewProperty.layout || previewProperty.area) && (
                      <p className="text-xs text-gray-600">
                        {previewProperty.layout || ''}{previewProperty.layout && previewProperty.area ? ' / ' : ''}{previewProperty.area ? `${previewProperty.area}㎡` : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 詳細ページプレビュー */}
              <div>
                <p className="text-sm text-gray-500 mb-3">■ 物件詳細ページでの表示</p>
                <div className="border border-gray-200">
                  {/* ヘッダー */}
                  <div className="bg-gray-900 text-white p-6">
                    <p className="text-sm text-gray-300 mb-2">
                      {previewProperty.prefecture || ''}{previewProperty.city || ''}
                    </p>
                    <h1 className="text-2xl font-light">
                      {previewProperty.title || "（物件名未設定）"}
                    </h1>
                  </div>
                  
                  {/* メイン画像 */}
                  <div className="h-64 bg-gray-100 flex items-center justify-center">
                    {(() => {
                      const images = previewProperty.images ? JSON.parse(previewProperty.images) : []
                      const firstImage = images[0]
                      return firstImage ? (
                        <img
                          src={firstImage}
                          alt={previewProperty.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">画像が設定されていません</p>
                        </div>
                      )
                    })()}
                  </div>
                  
                  {/* 物件情報 */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex">
                        <dt className="w-24 text-gray-500">販売価格</dt>
                        <dd className="text-gray-900 font-medium">
                          {previewProperty.price ? `${previewProperty.price.toLocaleString()}万円` : "未設定"}
                        </dd>
                      </div>
                      <div className="flex">
                        <dt className="w-24 text-gray-500">築年月</dt>
                        <dd className="text-gray-900">
                          {previewProperty.buildYear ? `${previewProperty.buildYear}年${previewProperty.buildMonth ? `${previewProperty.buildMonth}月` : ''}` : "未設定"}
                        </dd>
                      </div>
                      <div className="flex">
                        <dt className="w-24 text-gray-500">所在地</dt>
                        <dd className="text-gray-900">
                          {previewProperty.prefecture || previewProperty.city || previewProperty.address 
                            ? `${previewProperty.prefecture || ''}${previewProperty.city || ''}${previewProperty.address || ''}`
                            : "未設定"}
                        </dd>
                      </div>
                      <div className="flex">
                        <dt className="w-24 text-gray-500">間取り</dt>
                        <dd className="text-gray-900">
                          {previewProperty.layout || previewProperty.area 
                            ? `${previewProperty.layout || ''}${previewProperty.layout && previewProperty.area ? ' / ' : ''}${previewProperty.area ? `${previewProperty.area}㎡` : ''}`
                            : "未設定"}
                        </dd>
                      </div>
                    </div>
                    
                    {previewProperty.description && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">物件説明</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-4">
                          {previewProperty.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="mt-6 flex gap-4">
                <Link
                  href={`/properties/${previewProperty.id}/edit`}
                  className="flex-1 py-3 text-center bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                  onClick={() => setPreviewProperty(null)}
                >
                  編集する
                </Link>
                <Link
                  href={`/properties/${previewProperty.id}`}
                  className="flex-1 py-3 text-center border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setPreviewProperty(null)}
                >
                  実際のページを見る
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

