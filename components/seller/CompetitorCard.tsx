"use client"

import { useState } from "react"

interface Property {
  id: string
  prefecture?: string
  city?: string
  layout?: string | null
  price: number
  status: string
}

interface Competitor {
  name: string
  price: string
  layout: string
  area: string
  buildYear: string
  station: string
  source: string
}

interface CompetitorCardProps {
  properties: Property[]
}

export default function CompetitorCard({ properties }: CompetitorCardProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(false)
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [summary, setSummary] = useState("")

  const handleSearch = async (property: Property) => {
    setSelectedProperty(property)
    setLoading(true)
    setCompetitors([])
    setSummary("")

    try {
      const response = await fetch("/api/ai/competitor-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prefecture: property.prefecture,
          city: property.city,
          layout: property.layout,
          price: property.price,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setCompetitors(result.competitors || [])
        setSummary(result.summary || "")
      }
    } catch (error) {
      console.error("Competitor search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const activeProperties = properties.filter(p => p.status !== "SOLD")

  if (activeProperties.length === 0) return null

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-base font-medium text-gray-900">競合物件情報</h3>
      </div>

      {/* 物件選択 */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">調べたい物件を選択してください</p>
        <div className="flex flex-wrap gap-2">
          {activeProperties.map((property) => (
            <button
              key={property.id}
              onClick={() => handleSearch(property)}
              disabled={loading}
              className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                selectedProperty?.id === property.id
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              } disabled:opacity-50`}
            >
              {property.city} {property.layout || ""}
            </button>
          ))}
        </div>
      </div>

      {/* ローディング */}
      {loading && (
        <div className="text-center py-8">
          <svg className="animate-spin w-6 h-6 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p className="text-sm text-gray-500 mt-2">競合物件を検索中...</p>
        </div>
      )}

      {/* 結果表示 */}
      {!loading && competitors.length > 0 && (
        <div className="space-y-4">
          {/* サマリー */}
          {summary && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-xs font-medium text-blue-800 mb-1">AI分析</p>
              <p className="text-sm text-blue-700">{summary}</p>
            </div>
          )}

          {/* 競合物件リスト */}
          <div className="space-y-2">
            {competitors.map((comp, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded p-3 text-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900">{comp.name}</p>
                  <span className="text-xs text-gray-400">{comp.source}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>価格: <span className="font-medium text-gray-900">{comp.price}万円</span></div>
                  <div>間取り: {comp.layout}</div>
                  <div>面積: {comp.area}</div>
                  <div>築年: {comp.buildYear}</div>
                  <div className="col-span-2">最寄り: {comp.station}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 結果なし */}
      {!loading && selectedProperty && competitors.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          競合物件の情報が見つかりませんでした
        </p>
      )}

      <p className="text-xs text-gray-400 mt-4">
        ※ Web検索による参考情報です。最新の情報は各不動産サイトでご確認ください。
      </p>
    </div>
  )
}
