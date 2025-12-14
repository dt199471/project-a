"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import PropertyMessageForm from "@/components/property/PropertyMessageForm"
import FavoriteButton from "@/components/property/FavoriteButton"

interface Property {
  id: string
  title: string
  description: string
  price: number
  address: string
  city: string
  prefecture: string
  nearestStation?: string | null
  images: string
  userId: string
  user: {
    id: string
    name: string | null
    image: string | null
    email: string | null
  }
  createdAt: string
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    // Get current user from localStorage
    const userId = localStorage.getItem('userId')
    setCurrentUserId(userId)
  }, [])

  useEffect(() => {
    if (params.id) {
      fetchProperty()
    }
  }, [params.id, currentUserId])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProperty(data)
        if (currentUserId && data.userId === currentUserId) {
          setIsOwner(true)
        }
      } else {
        router.push("/properties")
      }
    } catch (error) {
      console.error("Error fetching property:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("本当にこの物件を削除しますか？")) return

    try {
      const response = await fetch(`/api/properties/${params.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/properties")
      } else {
        alert("削除に失敗しました")
      }
    } catch (error) {
      console.error("Error deleting property:", error)
      alert("削除に失敗しました")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <p className="text-xl font-semibold text-gray-900 mb-2">物件が見つかりません</p>
          <p className="text-gray-600">この物件は存在しないか、削除されました</p>
        </div>
      </div>
    )
  }

  const images = property.images ? JSON.parse(property.images) : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            <div>
              {images.length > 0 ? (
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={images[0]}
                      alt={property.title}
                      className="w-full h-96 object-cover"
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {images.slice(1, 5).map((img: string, idx: number) => (
                        <div key={idx} className="relative overflow-hidden rounded-lg border border-gray-200">
                          <img
                            src={img}
                            alt={`${property.title} ${idx + 2}`}
                            className="w-full h-24 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500">画像なし</p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {property.title}
                </h1>
                {currentUserId && !isOwner && (
                  <FavoriteButton propertyId={property.id} />
                )}
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-4xl font-bold text-blue-600">
                  ¥{property.price.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <span className="mr-2">📍</span>
                  <span className="font-medium">{property.prefecture} {property.city}</span>
                </div>
                <p className="text-gray-600 text-sm ml-6">{property.address}</p>
                {property.nearestStation && (
                  <div className="flex items-center text-gray-700 ml-6">
                    <span className="mr-2">🚃</span>
                    <span>最寄り駅: {property.nearestStation}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">説明</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {property.description}
                </p>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">出品者</h2>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                  {property.user.image && (
                    <img
                      src={property.user.image}
                      alt={property.user.name || "User"}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    />
                  )}
                  <span className="text-gray-700 font-medium">{property.user.name}</span>
                </div>
              </div>
              {isOwner ? (
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => router.push(`/properties/${property.id}/edit`)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    編集する
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    削除する
                  </button>
                </div>
              ) : (
                currentUserId && (
                  <PropertyMessageForm
                    propertyId={property.id}
                    receiverId={property.userId}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


