import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="cowcamo-container py-12 lg:py-20">
          <div className="col-span-full lg:col-start-2 text-center lg:text-left">
            <h1 className="text-3xl lg:text-5xl font-light text-gray-900 leading-relaxed">
              中古マンションの
              <br />
              <span className="font-medium text-blue-600">売買マッチング</span>
            </h1>
            <p className="mt-6 text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg">
              AIによる適正価格査定と、
              <br className="hidden lg:block" />
              個人間での直接取引を実現する
              <br className="hidden lg:block" />
              新しい不動産プラットフォーム
            </p>
            <div className="mt-10 flex flex-col lg:flex-row gap-4">
              <Link
                href="/properties"
                className="px-8 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors text-center"
              >
                物件を探す
              </Link>
              <Link
                href="/properties/new"
                className="px-8 py-3 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50 transition-colors text-center"
              >
                物件を売る
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="cowcamo-container">
          <div className="col-span-full lg:col-start-2">
            <h2 className="text-2xl lg:text-3xl font-light text-gray-900 mb-12 text-center lg:text-left">
              URUCAMOの特徴
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">AI価格査定</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    最新のマーケットデータとAI技術を活用した適正価格査定で、適切な価格での取引をサポートします
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">直接メッセージ</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    売主と買主が直接やり取りできるメッセージ機能で、スムーズなコミュニケーションを実現
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">リノベーション評価</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    専門家によるインテリア価値評価で、リノベーション物件の適正な価値を可視化
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">安全な取引</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    個人間取引でも安心できる、充実したサポート体制とセキュリティ機能
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


