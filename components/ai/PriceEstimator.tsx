"use client"

import { useState } from "react"

interface PriceEstimatorProps {
  propertyId?: string
  defaultData?: {
    area?: number
    buildYear?: number
    prefecture?: string
    city?: string
  }
}

export default function PriceEstimator({ propertyId, defaultData }: PriceEstimatorProps) {
  const [area, setArea] = useState(defaultData?.area?.toString() || "")
  const [buildYear, setBuildYear] = useState(defaultData?.buildYear?.toString() || "")
  const [prefecture, setPrefecture] = useState(defaultData?.prefecture || "東京都")
  const [city, setCity] = useState(defaultData?.city || "")
  const [estimating, setEstimating] = useState(false)
  const [result, setResult] = useState<{
    estimatedPrice: number
    priceRange: { min: number; max: number }
    confidence: number
  } | null>(null)

  const handleEstimate = async () => {
    setEstimating(true)

    // モック実装: 実際のAI機能は未実装
    // 簡易的な計算で価格を推定
    await new Promise(resolve => setTimeout(resolve, 2000)) // ローディング演出

    const areaNum = parseFloat(area) || 50
    const yearNum = parseInt(buildYear) || 2020
    const age = new Date().getFullYear() - yearNum

    // シンプルな価格計算（モック）
    let basePrice = areaNum * 500000 // 1㎡あたり50万円

    // 築年数による減価
    const depreciationRate = Math.max(0.5, 1 - (age * 0.02))
    basePrice *= depreciationRate

    // 都道府県による補正
    const prefectureMultiplier: { [key: string]: number } = {
      "東京都": 1.5,
      "大阪府": 1.2,
      "神奈川県": 1.3,
      "愛知県": 1.1,
    }
    basePrice *= prefectureMultiplier[prefecture] || 1.0

    const estimatedPrice = Math.round(basePrice / 10000) * 10000 // 1万円単位で丸める
    const variance = estimatedPrice * 0.15

    setResult({
      estimatedPrice,
      priceRange: {
        min: Math.round((estimatedPrice - variance) / 10000) * 10000,
        max: Math.round((estimatedPrice + variance) / 10000) * 10000,
      },
      confidence: Math.round(70 + Math.random() * 20), // 70-90%のランダムな信頼度
    })

    setEstimating(false)
  }

  const prefectures = [
    "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
    "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
    "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
    "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
    "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
    "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
    "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
  ]

  return (
    <div className="bg-white border border-gray-200 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-medium text-gray-900">AI価格査定</h2>
          <p className="text-sm text-gray-500">物件情報を入力して適正価格を診断</p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 p-4 mb-6">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-gray-900">
            <p className="font-medium mb-1">これはモック機能です</p>
            <p className="text-gray-600">実際のAI機能は未実装です。簡易的な計算式で価格を推定しています。</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            専有面積（㎡）<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="例: 60"
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            建築年<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={buildYear}
            onChange={(e) => setBuildYear(e.target.value)}
            placeholder="例: 2015"
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            都道府県<span className="text-red-500">*</span>
          </label>
          <select
            value={prefecture}
            onChange={(e) => setPrefecture(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white"
          >
            {prefectures.map((pref) => (
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
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="例: 渋谷区"
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>
      </div>

      <button
        onClick={handleEstimate}
        disabled={estimating || !area || !buildYear}
        className="w-full bg-gray-900 text-white py-3 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {estimating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>AI査定中...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>AI査定を開始</span>
          </>
        )}
      </button>

      {result && (
        <div className="mt-6 bg-gray-50 border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            査定結果
          </h3>

          <div className="bg-white border border-gray-200 p-5 mb-4">
            <p className="text-sm text-gray-600 mb-2">推定価格</p>
            <p className="text-4xl font-medium text-gray-900 mb-3">
              ¥{result.estimatedPrice.toLocaleString()}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>
                価格帯: ¥{result.priceRange.min.toLocaleString()} 〜 ¥{result.priceRange.max.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">信頼度</span>
              <span className="text-sm font-medium text-gray-900">{result.confidence}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2.5">
              <div
                className="bg-gray-900 h-2.5 transition-all duration-1000"
                style={{ width: `${result.confidence}%` }}
              ></div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            この査定結果は参考価格です。実際の取引価格とは異なる場合があります。
          </p>
        </div>
      )}
    </div>
  )
}
