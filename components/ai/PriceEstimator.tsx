"use client"

import { useState } from "react"

interface PriceEstimatorProps {
  propertyId?: string
  defaultData?: {
    mansionName?: string
    area?: number
    buildYear?: number
    prefecture?: string
    city?: string
    layout?: string
    direction?: string
  }
}

export default function PriceEstimator({ propertyId, defaultData }: PriceEstimatorProps) {
  const [mansionName, setMansionName] = useState(defaultData?.mansionName || "")
  const [area, setArea] = useState(defaultData?.area?.toString() || "")
  const [buildYear, setBuildYear] = useState(defaultData?.buildYear?.toString() || "")
  const [prefecture, setPrefecture] = useState(defaultData?.prefecture || "東京都")
  const [city, setCity] = useState(defaultData?.city || "")
  const [layout, setLayout] = useState(defaultData?.layout || "")
  const [direction, setDirection] = useState(defaultData?.direction || "")
  const [estimating, setEstimating] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<{
    estimatedPrice: number
    priceRange: { min: number; max: number }
    confidence: number
    reasoning: string
    transactionHistory?: string | null
    currentListings?: string | null
    dataSources?: string[] | null
  } | null>(null)

  const handleEstimate = async () => {
    setEstimating(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/ai-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mansionName: mansionName || undefined,
          area: parseFloat(area),
          buildYear: buildYear ? parseInt(buildYear) : undefined,
          prefecture,
          city: city || undefined,
          layout: layout || undefined,
          direction: direction || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "査定に失敗しました")
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b24b0ddd-9846-4da6-bed5-1b28613f60cf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PriceEstimator.tsx:57',message:'API response received',data:{transactionHistoryType:typeof data.transactionHistory,currentListingsType:typeof data.currentListings,transactionHistoryIsArray:Array.isArray(data.transactionHistory),currentListingsIsArray:Array.isArray(data.currentListings),transactionHistory:data.transactionHistory,currentListings:data.currentListings},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'C'})}).catch(()=>{});
      // #endregion

      // transactionHistoryとcurrentListingsがオブジェクトや配列の場合は文字列に変換
      const normalizedData = {
        ...data,
        transactionHistory: data.transactionHistory
          ? (typeof data.transactionHistory === 'string'
              ? data.transactionHistory
              : Array.isArray(data.transactionHistory)
                ? data.transactionHistory.map((item: any) =>
                    typeof item === 'object' ? JSON.stringify(item) : String(item)
                  ).join('\n')
                : typeof data.transactionHistory === 'object'
                  ? JSON.stringify(data.transactionHistory)
                  : String(data.transactionHistory))
          : null,
        currentListings: data.currentListings
          ? (typeof data.currentListings === 'string'
              ? data.currentListings
              : Array.isArray(data.currentListings)
                ? data.currentListings.map((item: any) =>
                    typeof item === 'object' ? JSON.stringify(item) : String(item)
                  ).join('\n')
                : typeof data.currentListings === 'object'
                  ? JSON.stringify(data.currentListings)
                  : String(data.currentListings))
          : null,
        dataSources: data.dataSources || null,
      }

      setResult(normalizedData)
    } catch (err: any) {
      setError(err.message || "査定に失敗しました")
    } finally {
      setEstimating(false)
    }
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

  const directions = ["南", "南東", "南西", "東", "西", "北東", "北西", "北"]
  const layouts = ["1R", "1K", "1DK", "1LDK", "2K", "2DK", "2LDK", "3K", "3DK", "3LDK", "4LDK以上"]

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

      <div className="bg-blue-50 border border-blue-100 p-4 mb-6">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Web検索連動AI査定</p>
            <p className="text-blue-700">マンション名を入力すると、最新の市場情報を検索して精度の高い査定を行います。</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            マンション名
            <span className="text-xs text-gray-500 ml-2">（入力すると精度向上）</span>
          </label>
          <input
            type="text"
            value={mansionName}
            onChange={(e) => setMansionName(e.target.value)}
            placeholder="例: パークハウス渋谷"
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
              建築年
            </label>
            <input
              type="number"
              value={buildYear}
              onChange={(e) => setBuildYear(e.target.value)}
              placeholder="例: 2015"
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              間取り
            </label>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white"
            >
              <option value="">選択してください</option>
              {layouts.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              向き
            </label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white"
            >
              <option value="">選択してください</option>
              {directions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        onClick={handleEstimate}
        disabled={estimating || !area}
        className="w-full bg-gray-900 text-white py-3 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {estimating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>{mansionName ? "市場情報を検索中..." : "AI査定中..."}</span>
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
              {(result.estimatedPrice / 10000).toLocaleString()}万円
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>
                価格帯: {(result.priceRange.min / 10000).toLocaleString()}万円 〜 {(result.priceRange.max / 10000).toLocaleString()}万円
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4 mb-4">
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

          {result.reasoning && (
            <div className="bg-white border border-gray-200 p-4 mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">査定理由</p>
              <p className="text-sm text-gray-600 leading-relaxed">{result.reasoning}</p>
            </div>
          )}

          {/* 過去に売れた価格（成約事例） */}
          {result.transactionHistory && (
            <div className="bg-green-50 border border-green-200 p-4 mb-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">過去に売れた価格</p>
                  <p className="text-xs text-green-600">同じマンションの成約実績</p>
                </div>
              </div>
              <div className="space-y-2">
                {result.transactionHistory.split('\n').filter(line => line.trim()).map((line, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-green-900 bg-white/50 px-3 py-2 rounded">
                    <span className="w-5 h-5 bg-green-200 text-green-700 rounded-full flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 現在販売中の物件 */}
          {result.currentListings && (
            <div className="bg-blue-50 border border-blue-200 p-4 mb-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">現在販売中の物件</p>
                  <p className="text-xs text-blue-600">今すぐ購入可能な物件</p>
                </div>
              </div>
              <div className="space-y-2">
                {result.currentListings.split('\n').filter(line => line.trim()).map((line, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-blue-900 bg-white/50 px-3 py-2 rounded">
                    <span className="w-5 h-5 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 情報ソース */}
          {result.dataSources && result.dataSources.length > 0 && (
            <div className="bg-gray-100 border border-gray-200 p-3 mb-4 rounded-lg">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500">情報参照元:</span>
                {result.dataSources.map((source, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white text-gray-600 px-2 py-1 rounded border border-gray-200"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-4 text-center">
            この査定結果は参考価格です。実際の取引価格とは異なる場合があります。
          </p>
        </div>
      )}
    </div>
  )
}
