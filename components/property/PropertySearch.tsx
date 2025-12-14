"use client"

import { useState } from "react"

interface PropertySearchProps {
  filters: {
    search: string
    minPrice: string
    maxPrice: string
    city: string
    prefecture: string
    nearestStation: string
    layout: string
    minArea: string
    maxArea: string
    minBuildYear: string
    maxBuildYear: string
    sortBy: string
    sortOrder: string
  }
  onFiltersChange: (filters: any) => void
}

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
]

const LAYOUTS = [
  "1R", "1K", "1DK", "1LDK",
  "2K", "2DK", "2LDK",
  "3K", "3DK", "3LDK",
  "4K", "4DK", "4LDK",
  "5K以上"
]

export default function PropertySearch({
  filters,
  onFiltersChange,
}: PropertySearchProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const handleChange = (field: string, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
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
  }

  return (
    <div className="bg-white border border-gray-200 p-6">
      {/* 基本検索 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            キーワード
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            placeholder="物件名、住所"
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            都道府県
          </label>
          <select
            value={filters.prefecture}
            onChange={(e) => handleChange("prefecture", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white text-sm"
          >
            <option value="">すべて</option>
            {PREFECTURES.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            市区町村
          </label>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="市区町村"
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            最寄り駅
          </label>
          <input
            type="text"
            value={filters.nearestStation}
            onChange={(e) => handleChange("nearestStation", e.target.value)}
            placeholder="駅名"
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            最低価格（万円）
          </label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            最高価格（万円）
          </label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
            placeholder="無制限"
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            間取り
          </label>
          <select
            value={filters.layout}
            onChange={(e) => handleChange("layout", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white text-sm"
          >
            <option value="">すべて</option>
            {LAYOUTS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            並び替え
          </label>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-")
              onFiltersChange({ ...filters, sortBy, sortOrder })
            }}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white text-sm"
          >
            <option value="createdAt-desc">新着順</option>
            <option value="createdAt-asc">古い順</option>
            <option value="price-asc">価格: 安い順</option>
            <option value="price-desc">価格: 高い順</option>
            <option value="area-desc">面積: 広い順</option>
            <option value="area-asc">面積: 狭い順</option>
          </select>
        </div>
      </div>

      {/* 詳細検索トグル */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          <svg 
            className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          詳細検索
        </button>
      </div>

      {/* 詳細検索 */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                最小面積（㎡）
              </label>
              <input
                type="number"
                value={filters.minArea}
                onChange={(e) => handleChange("minArea", e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                最大面積（㎡）
              </label>
              <input
                type="number"
                value={filters.maxArea}
                onChange={(e) => handleChange("maxArea", e.target.value)}
                placeholder="無制限"
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                築年（以降）
              </label>
              <input
                type="number"
                value={filters.minBuildYear}
                onChange={(e) => handleChange("minBuildYear", e.target.value)}
                placeholder="例: 2000"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                築年（以前）
              </label>
              <input
                type="number"
                value={filters.maxBuildYear}
                onChange={(e) => handleChange("maxBuildYear", e.target.value)}
                placeholder="例: 2024"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* クリアボタン */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          条件をクリア
        </button>
      </div>
    </div>
  )
}
