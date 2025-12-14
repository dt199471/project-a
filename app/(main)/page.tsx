import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Modern Standard Style */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm tracking-widest uppercase mb-4 text-gray-400">BUY</p>
            <h1 className="text-4xl lg:text-6xl font-light leading-tight mb-6">
              高級中古マンションを<br />買う
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              厳選された977件の物件から、あなたにぴったりの住まいを見つけてください
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/properties"
                className="px-8 py-4 bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors text-center"
              >
                物件を探す
              </Link>
              <a
                href="tel:0120-962-658"
                className="px-8 py-4 border border-white text-white text-sm font-medium hover:bg-white hover:text-gray-900 transition-colors text-center"
              >
                無料相談する 0120-962-658
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Link
              href="/properties?filterType=area"
              className="group bg-white p-6 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">SEARCH BY</p>
                  <h3 className="text-lg font-medium text-gray-900">区から探す</h3>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <Link
              href="/properties?filterType=station"
              className="group bg-white p-6 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">SEARCH BY</p>
                  <h3 className="text-lg font-medium text-gray-900">駅・路線から探す</h3>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <Link
              href="/properties?filterType=popular"
              className="group bg-white p-6 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">POPULAR</p>
                  <h3 className="text-lg font-medium text-gray-900">人気エリアから探す</h3>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* AI Features Section */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest uppercase mb-4 text-gray-500">FEATURES</p>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
              URUCAMOが選ばれる理由
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              最新のテクノロジーと専門知識を活用し、理想の住まい探しをサポートします
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">AI価格査定</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                最新のマーケットデータとAI技術を活用した適正価格査定
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">直接メッセージ</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                売主と買主が直接やり取りできるメッセージ機能
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">厳選された物件</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                質の高い中古マンションのみを厳選してご紹介
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">安全な取引</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                充実したサポート体制とセキュリティ機能で安心
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-light mb-6">
            住まいのアドバイザーに<br className="sm:hidden" />無料相談する
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            物件探しや売却に関するご相談は、専門のアドバイザーが無料でサポートいたします
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:0120-962-658"
              className="flex items-center gap-3 text-2xl font-light"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              0120-962-658
            </a>
            <span className="text-gray-500">|</span>
            <Link
              href="/properties"
              className="px-8 py-3 border border-white text-white text-sm font-medium hover:bg-white hover:text-gray-900 transition-colors"
            >
              物件を探す
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Areas Section */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-sm tracking-widest uppercase mb-4 text-gray-500">POPULAR AREAS</p>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900">人気エリアから探す</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "渋谷区", "港区", "目黒区", "世田谷区",
              "千代田区", "中央区", "新宿区", "文京区",
              "品川区", "大田区", "中野区", "杉並区"
            ].map((area) => (
              <Link
                key={area}
                href={`/properties?city=${area}`}
                className="group p-6 border border-gray-200 hover:border-gray-900 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{area}</span>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-medium text-gray-900 mb-4">物件を売却したい方</h3>
              <p className="text-gray-600 mb-6">
                AI価格査定で適正価格をすぐに確認できます
              </p>
              <Link
                href="/ai-estimator"
                className="inline-block px-8 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                AI査定を試す
              </Link>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-medium text-gray-900 mb-4">物件を購入したい方</h3>
              <p className="text-gray-600 mb-6">
                厳選された物件から理想の住まいを見つけてください
              </p>
              <Link
                href="/properties"
                className="inline-block px-8 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                物件を探す
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
