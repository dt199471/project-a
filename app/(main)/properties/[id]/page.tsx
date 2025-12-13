"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
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
  const { data: session } = useSession()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProperty()
    }
  }, [params.id, session])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProperty(data)
        if (session?.user?.id && data.userId === session.user.id) {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">物件が見つかりません</div>
      </div>
    )
  }

  const images = property.images ? JSON.parse(property.images) : []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            <div>
              {images.length > 0 ? (
                <div className="space-y-2">
                  <img
                    src={images[0]}
                    alt={property.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {images.slice(1, 5).map((img: string, idx: number) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${property.title} ${idx + 2}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                  画像なし
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {property.title}
                </h1>
                {session && !isOwner && (
                  <FavoriteButton propertyId={property.id} />
                )}
              </div>
              <p className="text-3xl font-bold text-indigo-600 mb-4">
                ¥{property.price.toLocaleString()}
              </p>
              <div className="mb-4">
                <p className="text-gray-600">
                  {property.prefecture} {property.city}
                </p>
                <p className="text-gray-500 text-sm">{property.address}</p>
                {property.nearestStation && (
                  <p className="text-gray-600 text-sm mt-1">
                    🚃 最寄り駅: {property.nearestStation}
                  </p>
                )}
              </div>
              <div className="border-t pt-4 mb-4">
                <h2 className="text-lg font-semibold mb-2">説明</h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>
              <div className="border-t pt-4 mb-4">
                <h2 className="text-lg font-semibold mb-2">出品者</h2>
                <div className="flex items-center space-x-3">
                  {property.user.image && (
                    <img
                      src={property.user.image}
                      alt={property.user.name || "User"}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <span className="text-gray-700">{property.user.name}</span>
                </div>
              </div>
              {isOwner ? (
                <div className="flex space-x-4">
                  <button
                    onClick={() => router.push(`/properties/${property.id}/edit`)}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    編集
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    削除
                  </button>
                </div>
              ) : (
                session && (
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


