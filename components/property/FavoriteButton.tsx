"use client"

import { useState, useEffect } from "react"

interface FavoriteButtonProps {
  propertyId: string
}

export default function FavoriteButton({ propertyId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    // Get current user from localStorage
    const userId = localStorage.getItem('userId')
    setCurrentUserId(userId)
  }, [])

  useEffect(() => {
    if (currentUserId) {
      checkFavorite()
    }
  }, [currentUserId, propertyId])

  const checkFavorite = async () => {
    try {
      const response = await fetch(`/api/favorites/check?propertyId=${propertyId}`)
      if (response.ok) {
        const data = await response.json()
        setIsFavorite(data.isFavorite)
      }
    } catch (error) {
      console.error("Error checking favorite:", error)
    }
  }

  const toggleFavorite = async () => {
    if (!currentUserId) return

    setLoading(true)
    try {
      if (isFavorite) {
        const response = await fetch(
          `/api/favorites?propertyId=${propertyId}`,
          { method: "DELETE" }
        )
        if (response.ok) {
          setIsFavorite(false)
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId, userId: currentUserId }),
        })
        if (response.ok) {
          setIsFavorite(true)
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!currentUserId) return null

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`px-4 py-2 rounded-md transition-colors ${
        isFavorite
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      } disabled:opacity-50`}
    >
      {isFavorite ? "❤️ お気に入り済み" : "🤍 お気に入りに追加"}
    </button>
  )
}

