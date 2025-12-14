"use client"

import { useEffect, useState } from "react"
import PropertyCard from "@/components/property/PropertyCard"
import PropertySearch from "@/components/property/PropertySearch"

interface Property {
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
  images: string
  user: {
    name: string | null
    image: string | null
  }
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    city: "",
    prefecture: "",
    nearestStation: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  useEffect(() => {
    fetchProperties()
  }, [filters])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append("search", filters.search)
      if (filters.minPrice) params.append("minPrice", filters.minPrice)
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice)
      if (filters.city) params.append("city", filters.city)
      if (filters.prefecture) params.append("prefecture", filters.prefecture)
      if (filters.nearestStation) params.append("nearestStation", filters.nearestStation)
      params.append("sortBy", filters.sortBy)
      params.append("sortOrder", filters.sortOrder)

      const response = await fetch(`/api/properties?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-sm tracking-widest uppercase mb-4 text-gray-500">PROPERTIES</p>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">物件を探す</h1>
          <p className="text-gray-600">
            {properties.length > 0 ? `${properties.length}件の物件` : "条件に合う物件を検索"}
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PropertySearch filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600 text-sm">読み込み中...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 border border-gray-200">
            <p className="text-lg font-medium text-gray-900 mb-2">物件が見つかりませんでした</p>
            <p className="text-gray-600 text-sm">検索条件を変更してお試しください</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
