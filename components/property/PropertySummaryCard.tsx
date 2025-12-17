"use client"

import { useState } from "react"

interface PropertySummaryCardProps {
  property: {
    title: string
    price: number
    prefecture: string
    city: string
    address: string
    images: string
    createdAt?: string
    updatedAt?: string
  }
  buildYear?: number | null
  buildMonth?: number | null
  layout?: string | null
  area?: number | null
  floor?: number | null
}

export default function PropertySummaryCard({ property, buildYear, buildMonth, layout, area, floor }: PropertySummaryCardProps) {
  const images = property.images ? JSON.parse(property.images) : []
  const [currentIndex, setCurrentIndex] = useState(0)

  // 築年月を計算
  let buildDate = null
  if (buildYear) {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    let years = currentYear - buildYear
    let months = 0
    
    if (buildMonth) {
      months = currentMonth - buildMonth
      if (months < 0) {
        years -= 1
        months += 12
      }
      buildDate = `${buildYear}年${buildMonth}月（${years}年${months > 0 ? `${months}ヶ月` : ''}）`
    } else {
      buildDate = `${buildYear}年築（${years}年）`
    }
  }

  // 更新日の計算
  const getUpdateText = () => {
    if (!property.updatedAt && !property.createdAt) return null
    const date = new Date(property.updatedAt || property.createdAt || "")
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "本日更新"
    if (diffDays === 1) return "昨日更新"
    if (diffDays < 30) return `${diffDays}日前更新`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前更新`
    return `${Math.floor(diffDays / 365)}年前更新`
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="bg-white">
      {/* ヘッダー情報 */}
      <div className="mb-4">
        <h1 className="text-2xl font-medium text-gray-900 mb-2">
          {property.title}
        </h1>
        <p className="text-lg text-gray-700">
          {floor && `${floor}階 `}
          {layout && `${layout} `}
          <span className="font-medium">{property.price.toLocaleString()}万円</span>
        </p>
      </div>

      {/* 画像ギャラリー */}
      <div className="mb-4">
        {/* メイン画像 */}
        <div className="relative bg-gray-100 aspect-[16/10] overflow-hidden">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentIndex]}
                alt={`${property.title} - ${currentIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* 画像枚数インジケーター */}
              <div className="absolute top-4 left-4 bg-gray-900/80 text-white text-sm px-3 py-1">
                {currentIndex + 1} / {images.length}
              </div>

              {/* 更新日 */}
              {getUpdateText() && (
                <div className="absolute top-4 right-4 bg-gray-900/80 text-white text-sm px-3 py-1">
                  {getUpdateText()}
                </div>
              )}

              {/* 左右矢印 */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                    aria-label="前の画像"
                  >
                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                    aria-label="次の画像"
                  >
                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* サムネイル一覧 */}
        {images.length > 1 && (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
            {images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleThumbnailClick(idx)}
                className={`flex-shrink-0 w-20 h-16 overflow-hidden border-2 transition-colors ${
                  idx === currentIndex ? "border-gray-900" : "border-transparent hover:border-gray-400"
                }`}
              >
                <img
                  src={img}
                  alt={`サムネイル ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* 注意書き */}
        <p className="text-xs text-gray-500 mt-2">
          ※写真や図と現況が異なる場合は現況を優先させていただきます。
        </p>
      </div>

      {/* 物件基本情報 */}
      <div className="border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex py-2 border-b border-gray-100">
            <dt className="w-24 text-sm text-gray-600">販売価格</dt>
            <dd className="flex-1 text-lg font-medium text-gray-900">
              {property.price.toLocaleString()}万円
            </dd>
          </div>

          {buildDate && (
            <div className="flex py-2 border-b border-gray-100">
              <dt className="w-24 text-sm text-gray-600">築年月</dt>
              <dd className="flex-1 text-sm text-gray-900">{buildDate}</dd>
            </div>
          )}

          <div className="flex py-2 border-b border-gray-100">
            <dt className="w-24 text-sm text-gray-600">所在地</dt>
            <dd className="flex-1 text-sm text-gray-900">
              {property.prefecture}{property.city}{property.address}
            </dd>
          </div>

          {(layout || area) && (
            <div className="flex py-2 border-b border-gray-100">
              <dt className="w-24 text-sm text-gray-600">間取り</dt>
              <dd className="flex-1 text-sm text-gray-900">
                {layout && <span>{layout}</span>}
                {layout && area && <span> / </span>}
                {area && <span>{area}㎡</span>}
              </dd>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
