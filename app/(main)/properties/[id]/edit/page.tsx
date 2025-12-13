"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import PropertyForm from "@/components/property/PropertyForm"

interface Property {
  id: string
  title: string
  description: string
  price: number
  address: string
  city: string
  prefecture: string
  images: string
  userId: string
}

export default function EditPropertyPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated" && params.id) {
      fetchProperty()
    }
  }, [status, params.id])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        if (session?.user?.id && data.userId !== session.user.id) {
          router.push("/properties")
          return
        }
        setProperty(data)
      } else {
        router.push("/properties")
      }
    } catch (error) {
      console.error("Error fetching property:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push("/auth/signin")
    return null
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <PropertyForm property={property} />
      </div>
    </div>
  )
}



