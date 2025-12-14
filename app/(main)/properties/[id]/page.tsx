"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import PropertyMessageForm from "@/components/property/PropertyMessageForm"
import FavoriteButton from "@/components/property/FavoriteButton"
import PropertySummaryCard from "@/components/property/PropertySummaryCard"

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
  buildYear?: number | null
  buildMonth?: number | null
  layout?: string | null
  area?: number | null
  structure?: string | null
  floor?: number | null
  totalFloors?: number | null
  direction?: string | null
  parking?: boolean
  petAllowed?: boolean
  managementFee?: number | null
  repairReserve?: number | null
  renovationHistory?: string | null
  status?: string
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProperty()
    }
  }, [params.id, user?.id])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProperty(data)
        if (user?.id && data.userId === user.id) {
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-light text-gray-900 mb-2">物件が見つかりません</p>
          <p className="text-gray-600">この物件は存在しないか、削除されました</p>
        </div>
      </div>
    )
  }

  const images = property.images ? JSON.parse(property.images) : []

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <p className="text-sm tracking-widest uppercase text-gray-500">PROPERTY DETAIL</p>
            {user && !isOwner && (
              <FavoriteButton propertyId={property.id} />
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Property Summary Card */}
        <div className="mb-12">
          <div className="relative">
            <PropertySummaryCard
              property={property}
              buildYear={property.buildYear}
              buildMonth={property.buildMonth}
              layout={property.layout}
              area={property.area}
            />
            {/* お気に入りボタン（タイル内） */}
            {user && !isOwner && (
              <div className="absolute top-4 right-4 z-10">
                <FavoriteButton propertyId={property.id} />
              </div>
            )}
          </div>
        </div>

        {/* Additional Images */}
        {images.length > 1 && (
          <div className="mb-12">
            <h2 className="text-xl font-light text-gray-900 mb-6">その他の写真</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.slice(1).map((img: string, idx: number) => (
                <div key={idx} className="relative h-48 bg-gray-100 overflow-hidden border border-gray-200">
                  <img
                    src={img}
                    alt={`${property.title} ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-12 border-t border-gray-200 pt-12">
          <h2 className="text-xl font-light text-gray-900 mb-6">物件説明</h2>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* PROPERTY DETAIL Section */}
        <div className="mb-12 border-t border-gray-200 pt-12">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm tracking-widest uppercase text-gray-500">PROPERTY DETAIL</p>
            {/* お気に入りボタン（PROPERTY DETAIL内） */}
            {user && !isOwner && (
              <FavoriteButton propertyId={property.id} />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex border-b border-gray-200 pb-4">
              <dt className="w-40 text-sm text-gray-600 font-light">販売価格</dt>
              <dd className="flex-1 text-sm text-gray-900 font-light">
                {property.price.toLocaleString()}万円
              </dd>
            </div>
            {property.buildYear && (
              <div className="flex border-b border-gray-200 pb-4">
                <dt className="w-40 text-sm text-gray-600 font-light">築年月</dt>
                <dd className="flex-1 text-sm text-gray-900 font-light">
                  {property.buildYear}年{property.buildMonth ? `${property.buildMonth}月` : ''}築
                </dd>
              </div>
            )}
            {(property.layout || property.area) && (
              <div className="flex border-b border-gray-200 pb-4">
                <dt className="w-40 text-sm text-gray-600 font-light">間取り / 専有面積</dt>
                <dd className="flex-1 text-sm text-gray-900 font-light">
                  {property.layout || '-'}
                  {property.area && ` / ${property.area}㎡`}
                </dd>
              </div>
            )}
            <div className="flex border-b border-gray-200 pb-4">
              <dt className="w-40 text-sm text-gray-600 font-light">所在地</dt>
              <dd className="flex-1 text-sm text-gray-900 font-light">
                {property.prefecture}{property.city}{property.address}
              </dd>
            </div>
            {property.nearestStation && (
              <div className="flex border-b border-gray-200 pb-4">
                <dt className="w-40 text-sm text-gray-600 font-light">最寄り駅</dt>
                <dd className="flex-1 text-sm text-gray-900 font-light">
                  {property.nearestStation}
                </dd>
              </div>
            )}
            {property.structure && (
              <div className="flex border-b border-gray-200 pb-4">
                <dt className="w-40 text-sm text-gray-600 font-light">建物構造</dt>
                <dd className="flex-1 text-sm text-gray-900 font-light">
                  {property.structure}
                </dd>
              </div>
            )}
            {(property.floor || property.totalFloors) && (
              <div className="flex border-b border-gray-200 pb-4">
                <dt className="w-40 text-sm text-gray-600 font-light">階数</dt>
                <dd className="flex-1 text-sm text-gray-900 font-light">
                  {property.floor ? `${property.floor}階` : '-'}
                  {property.totalFloors && ` / ${property.totalFloors}階建`}
                </dd>
              </div>
            )}
            {property.direction && (
              <div className="flex border-b border-gray-200 pb-4">
                <dt className="w-40 text-sm text-gray-600 font-light">向き</dt>
                <dd className="flex-1 text-sm text-gray-900 font-light">
                  {property.direction}向き
                </dd>
              </div>
            )}
            {(property.managementFee !== null && property.managementFee !== undefined) && (
              <div className="flex border-b border-gray-200 pb-4">
                <dt className="w-40 text-sm text-gray-600 font-light">管理費</dt>
                <dd className="flex-1 text-sm text-gray-900 font-light">
                  {property.managementFee.toLocaleString()}円/月
                </dd>
              </div>
            )}
            {(property.repairReserve !== null && property.repairReserve !== undefined) && (
              <div className="flex border-b border-gray-200 pb-4">
                <dt className="w-40 text-sm text-gray-600 font-light">修繕積立金</dt>
                <dd className="flex-1 text-sm text-gray-900 font-light">
                  {property.repairReserve.toLocaleString()}円/月
                </dd>
              </div>
            )}
            <div className="flex border-b border-gray-200 pb-4">
              <dt className="w-40 text-sm text-gray-600 font-light">駐車場</dt>
              <dd className="flex-1 text-sm text-gray-900 font-light">
                {property.parking ? 'あり' : 'なし'}
              </dd>
            </div>
            <div className="flex border-b border-gray-200 pb-4">
              <dt className="w-40 text-sm text-gray-600 font-light">ペット</dt>
              <dd className="flex-1 text-sm text-gray-900 font-light">
                {property.petAllowed ? '可' : '不可'}
              </dd>
            </div>
            <div className="flex border-b border-gray-200 pb-4">
              <dt className="w-40 text-sm text-gray-600 font-light">物件種別</dt>
              <dd className="flex-1 text-sm text-gray-900 font-light">マンション</dd>
            </div>
          </div>
        </div>

        {/* リフォーム履歴 */}
        {property.renovationHistory && (
          <div className="mb-12 border-t border-gray-200 pt-12">
            <h2 className="text-xl font-light text-gray-900 mb-6">リフォーム履歴</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {property.renovationHistory}
            </p>
          </div>
        )}

        {/* Nearest Station */}
        {property.nearestStation && (
          <div className="mb-12 border-t border-gray-200 pt-12">
            <h2 className="text-xl font-light text-gray-900 mb-6">交通</h2>
            <p className="text-gray-700">{property.nearestStation}</p>
          </div>
        )}

        {/* Seller Info */}
        <div className="mb-12 border-t border-gray-200 pt-12">
          <h2 className="text-xl font-light text-gray-900 mb-6">出品者情報</h2>
          <div className="flex items-center space-x-4 bg-gray-50 border border-gray-200 p-6">
            {property.user.image && (
              <img
                src={property.user.image}
                alt={property.user.name || "User"}
                className="w-16 h-16 rounded-full"
              />
            )}
            <span className="text-gray-900 font-light text-lg">{property.user.name}</span>
          </div>
        </div>

        {/* Actions */}
        {isOwner ? (
          <div className="flex flex-col sm:flex-row gap-4 border-t border-gray-200 pt-12">
            <button
              onClick={() => router.push(`/properties/${property.id}/edit`)}
              className="flex-1 px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 font-light transition-colors text-center"
            >
              編集する
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-8 py-4 bg-white text-gray-900 border border-gray-900 hover:bg-gray-50 font-light transition-colors text-center"
            >
              削除する
            </button>
          </div>
        ) : (
          currentUserId && (
            <div className="border-t border-gray-200 pt-12">
              <h2 className="text-xl font-light text-gray-900 mb-6">お問い合わせ</h2>
              <PropertyMessageForm
                propertyId={property.id}
                receiverId={property.userId}
              />
            </div>
          )
        )}
      </div>
    </div>
  )
}


