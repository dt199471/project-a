import PriceEstimator from "@/components/ai/PriceEstimator"

export default function AIEstimatorPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-sm tracking-widest uppercase mb-4 text-gray-500">AI ESTIMATOR</p>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
            AI価格査定
          </h1>
          <p className="text-gray-600 leading-relaxed">
            物件情報を入力するだけで、AIが適正価格を自動で算出します
          </p>
        </div>
      </div>

      {/* Estimator Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PriceEstimator />
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-medium text-gray-900 mb-6">AI価格査定の特徴</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1 text-sm">瞬時に査定</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  物件情報を入力するだけで、数秒で査定結果が得られます
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1 text-sm">多様なデータ分析</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  エリア、築年数、面積などの情報を総合的に分析
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1 text-sm">完全無料</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  何度でも無料でご利用いただけます
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1 text-sm">信頼性の高い査定</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  信頼度スコアで査定の確度をお知らせ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-50 border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-4 text-sm">ご注意事項</h3>
          <ul className="text-sm text-gray-600 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span>査定結果はあくまで参考価格です。実際の取引価格とは異なる場合があります。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span>より正確な査定をご希望の場合は、専門の不動産会社にご相談ください。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span>市場の状況により、価格は常に変動します。</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
