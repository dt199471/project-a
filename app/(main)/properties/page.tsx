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

interface Pagination {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasMore: boolean
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
    hasMore: false,
  })
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    city: "",
    prefecture: "",
    nearestStation: "",
    layout: "",
    minArea: "",
    maxArea: "",
    minBuildYear: "",
    maxBuildYear: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  useEffect(() => {
    fetchProperties(1)
  }, [filters])

  useEffect(() => {
    fetchProperties(pagination.page)
  }, [pagination.page])

  const fetchProperties = async (page: number = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append("search", filters.search)
      if (filters.minPrice) params.append("minPrice", filters.minPrice)
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice)
      if (filters.city) params.append("city", filters.city)
      if (filters.prefecture) params.append("prefecture", filters.prefecture)
      if (filters.nearestStation) params.append("nearestStation", filters.nearestStation)
      if (filters.layout) params.append("layout", filters.layout)
      if (filters.minArea) params.append("minArea", filters.minArea)
      if (filters.maxArea) params.append("maxArea", filters.maxArea)
      if (filters.minBuildYear) params.append("minBuildYear", filters.minBuildYear)
      if (filters.maxBuildYear) params.append("maxBuildYear", filters.maxBuildYear)
      params.append("sortBy", filters.sortBy)
      params.append("sortOrder", filters.sortOrder)
      params.append("page", page.toString())
      params.append("limit", "20")

      const response = await fetch(`/api/properties?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage })
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
            {pagination.totalCount > 0 ? `${pagination.totalCount}件の物件` : "条件に合う物件を検索"}
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* ページネーション */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  前へ
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // 現在のページ周辺と最初・最後のページを表示
                      const current = pagination.page
                      return page === 1 || 
                             page === pagination.totalPages || 
                             (page >= current - 2 && page <= current + 2)
                    })
                    .map((page, index, array) => (
                      <span key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 flex items-center justify-center text-sm transition-colors ${
                            page === pagination.page
                              ? 'bg-gray-900 text-white'
                              : 'border border-gray-300 text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </span>
                    ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  次へ
                </button>
              </div>
            )}

            <div className="mt-4 text-center text-sm text-gray-500">
              {pagination.totalCount}件中 {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.totalCount)}件を表示
            </div>
          </>
        )}
      </div>
    </div>
  )
}
