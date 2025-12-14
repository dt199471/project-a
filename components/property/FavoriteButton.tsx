"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

interface FavoriteButtonProps {
  propertyId: string
}

export default function FavoriteButton({ propertyId }: FavoriteButtonProps) {
  const { user, loading: authLoading } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.id) {
      checkFavorite()
    }
  }, [user?.id, propertyId])

  const checkFavorite = async () => {
    try {
      const response = await fetch(`/api/favorites/check?propertyId=${propertyId}&userId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setIsFavorite(data.isFavorite)
      }
    } catch (error) {
      console.error("Error checking favorite:", error)
    }
  }

  const toggleFavorite = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      if (isFavorite) {
        const response = await fetch(
          `/api/favorites?propertyId=${propertyId}&userId=${user.id}`,
          { method: "DELETE" }
        )
        if (response.ok) {
          setIsFavorite(false)
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId, userId: user.id }),
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

  if (authLoading) return null

  if (!user) {
    return (
      <Link
        href="/auth"
        className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        お気に入りに追加
      </Link>
    )
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`px-6 py-3 text-sm font-medium transition-colors inline-flex items-center gap-2 disabled:opacity-50 ${
        isFavorite
          ? "bg-gray-900 text-white hover:bg-gray-800"
          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {isFavorite ? (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          お気に入り済み
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          お気に入りに追加
        </>
      )}
    </button>
  )
}
