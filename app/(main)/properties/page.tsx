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
    <div className="min-h-screen bg-white py-8 lg:py-12">
      <div className="cowcamo-container">
        <div className="col-span-full lg:col-start-2 mb-8">
          <h1 className="text-2xl lg:text-3xl font-light text-gray-900 mb-3">物件を探す</h1>
          <p className="text-base text-gray-600">条件に合う物件を検索できます</p>
        </div>
        <div className="col-span-full lg:col-start-2">
          <PropertySearch filters={filters} onFiltersChange={setFilters} />
        </div>
        {loading ? (
          <div className="col-span-full lg:col-start-2 text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 text-sm">読み込み中...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="col-span-full lg:col-start-2 text-center py-16 bg-gray-50 rounded-lg mt-6">
            <p className="text-lg font-medium text-gray-900 mb-2">物件が見つかりませんでした</p>
            <p className="text-gray-600 text-sm">検索条件を変更してお試しください</p>
          </div>
        ) : (
          <div className="col-span-full lg:col-start-2 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


