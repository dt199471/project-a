"use client"

import { useEffect, useState } from "react"
import PropertyCard from "@/components/property/PropertyCard"

interface Favorite {
  id: string
  property: {
    id: string
    title: string
    description: string
    price: number
    address: string
    city: string
    prefecture: string
    images: string
    user: {
      name: string | null
      image: string | null
    }
  }
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/favorites")
      if (response.ok) {
        const data = await response.json()
        setFavorites(data)
      }
    } catch (error) {
      console.error("Error fetching favorites:", error)
    } finally {
      setLoading(false)
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">お気に入り</h1>
        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">お気に入りの物件はありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <PropertyCard
                key={favorite.id}
                property={favorite.property}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}







