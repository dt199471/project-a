"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"

interface PropertyCardProps {
  property: {
    id: string
    title: string
    description: string
    price: number
    address: string
    city: string
    prefecture: string
    nearestStation?: string | null
    buildYear?: number | null
    buildMonth?: number | null
    layout?: string | null
    area?: number | null
    status?: string
    images: string
    userId?: string
    user: {
      name: string | null
      image: string | null
    }
  }
}

const STATUS_LABELS: { [key: string]: { label: string; color: string } } = {
  ACTIVE: { label: "公開中", color: "bg-green-500" },
  NEGOTIATING: { label: "交渉中", color: "bg-yellow-500" },
  SOLD: { label: "成約済み", color: "bg-red-500" },
  DRAFT: { label: "下書き", color: "bg-gray-500" },
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const images = property.images ? JSON.parse(property.images) : []
  const firstImage = images[0]

  // ログインしている場合、お気に入り状態を確認
  useEffect(() => {
    if (user?.id && property.id) {
      checkFavoriteStatus()
    }
  }, [user?.id, property.id])

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/favorites/check?propertyId=${property.id}&userId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setIsFavorite(data.isFavorite)
      }
    } catch (error) {
      console.error("Error checking favorite status:", error)
    }
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user?.id) {
      return
    }

    setIsLoading(true)
    try {
      if (isFavorite) {
        const response = await fetch(`/api/favorites?propertyId=${property.id}&userId=${user.id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setIsFavorite(false)
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId: property.id,
            userId: user.id,
          }),
        })
        if (response.ok) {
          setIsFavorite(true)
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 築年月を計算
  let buildDate = null
  if (property.buildYear) {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    let years = currentYear - property.buildYear
    let months = 0
    
    if (property.buildMonth) {
      months = currentMonth - property.buildMonth
      if (months < 0) {
        years -= 1
        months += 12
      }
      buildDate = `${property.buildYear}年${property.buildMonth}月（${years}年${months > 0 ? `${months}ヶ月` : ''}）`
    } else {
      buildDate = `${property.buildYear}年築（${years}年）`
    }
  }

  // 間取りと面積の表示
  const layoutDisplay = property.layout 
    ? property.area 
      ? `${property.layout} / ${property.area}㎡${property.area * 1.8 ? `〜${(property.area * 1.8).toFixed(2)}㎡` : ''}`
      : property.layout
    : null

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="group bg-white border border-gray-200 hover:border-gray-900 transition-all shadow-md hover:shadow-xl overflow-hidden">
        <div className="relative h-80 w-full bg-gray-100 overflow-hidden">
          {firstImage ? (
            <img
              src={firstImage}
              alt={property.title}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${property.status === 'SOLD' ? 'opacity-60' : ''}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {/* ステータスバッジ */}
          {property.status && property.status !== 'ACTIVE' && (
            <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium text-white ${STATUS_LABELS[property.status]?.color || 'bg-gray-500'}`}>
              {STATUS_LABELS[property.status]?.label || property.status}
            </div>
          )}
          {/* お気に入りボタン（ハートマーク） */}
          {user && user.id !== property.userId && (
            <button
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all z-10"
              aria-label={isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
            >
              {isFavorite ? (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-lg font-light text-gray-900 mb-4 leading-relaxed line-clamp-2">
            {property.title}
          </h3>
          <p className="text-xl font-light text-gray-900 mb-3">
            {/* #region agent log */}
            {(() => {
              const priceInYen = property.price;
              const priceInManYen = priceInYen / 10000;
              fetch('http://127.0.0.1:7242/ingest/b24b0ddd-9846-4da6-bed5-1b28613f60cf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PropertyCard.tsx:176',message:'Price formatting',data:{priceInYen,priceInManYen,formatted:priceInManYen.toLocaleString()},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A'})}).catch(()=>{});
              return `${priceInManYen.toLocaleString()}万円`;
            })()}
            {/* #endregion */}
          </p>
          {buildDate && (
            <p className="text-sm text-gray-600 mb-2">
              {buildDate}
            </p>
          )}
          {layoutDisplay && (
            <p className="text-sm text-gray-600">
              {layoutDisplay}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
