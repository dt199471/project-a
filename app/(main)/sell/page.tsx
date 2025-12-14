import Link from "next/link"

export default function SellPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm tracking-widest uppercase mb-4 text-gray-400">SELL</p>
            <h1 className="text-4xl lg:text-6xl font-light leading-tight mb-6">
              高級中古マンションを<br />売る
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              AI価格査定で適正価格を確認し、個人間取引で仲介手数料を削減。<br />
              あなたの大切な資産を、最適な価格で売却しましょう。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/ai-estimator"
                className="px-8 py-4 bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors text-center"
              >
                AI査定を試す
              </Link>
              <Link
                href="/properties/new"
                className="px-8 py-4 border border-white text-white text-sm font-medium hover:bg-white hover:text-gray-900 transition-colors text-center"
              >
                物件を登録する
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest uppercase mb-4 text-gray-500">BENEFITS</p>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
              URUCAMOで売却する3つのメリット
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3 text-center">仲介手数料0円</h3>
              <p className="text-sm text-gray-600 leading-relaxed text-center">
                個人間取引により仲介手数料が不要。<br />
                3,000万円の物件なら最大約100万円の節約に。
              </p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3 text-center">AI価格査定</h3>
              <p className="text-sm text-gray-600 leading-relaxed text-center">
                最新のマーケットデータとAI技術で、<br />
                適正価格を瞬時に算出。売り出し価格の参考に。
              </p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3 text-center">買主と直接交渉</h3>
              <p className="text-sm text-gray-600 leading-relaxed text-center">
                メッセージ機能で買主と直接やり取り。<br />
                物件の魅力を直接伝えられます。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest uppercase mb-4 text-gray-500">PROCESS</p>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
              売却の流れ
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-light">
                1
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">AI価格査定</h3>
              <p className="text-sm text-gray-600">
                物件情報を入力して適正価格を確認
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-light">
                2
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">物件登録</h3>
              <p className="text-sm text-gray-600">
                写真と詳細情報を登録して公開
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-light">
                3
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">買主と交渉</h3>
              <p className="text-sm text-gray-600">
                メッセージで直接やり取り
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-light">
                4
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">契約・引渡し</h3>
              <p className="text-sm text-gray-600">
                条件合意後、契約手続きへ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest uppercase mb-4 text-gray-500">FAQ</p>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
              よくある質問
            </h2>
          </div>
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                本当に仲介手数料は0円ですか？
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                はい、個人間取引のため仲介手数料は発生しません。ただし、契約書作成などで司法書士への報酬が必要になる場合があります。
              </p>
            </div>
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                AI査定の精度はどのくらいですか？
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                最新の取引データを基に算出していますが、あくまで参考価格です。実際の売却価格は市場の需要や物件の状態によって変動します。
              </p>
            </div>
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                売却にかかる費用は何がありますか？
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                登記費用、印紙税、譲渡所得税などが発生する場合があります。詳しくは税理士や司法書士にご相談ください。
              </p>
            </div>
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                どのくらいの期間で売却できますか？
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                物件の条件や価格設定によって異なりますが、通常1〜3ヶ月程度です。人気エリアや適正価格であれば、より早く売却できる可能性があります。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-light mb-6">
            まずはAI価格査定から<br className="sm:hidden" />始めてみませんか？
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            無料で適正価格を確認できます。査定後、そのまま物件登録も可能です。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/ai-estimator"
              className="px-8 py-4 bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              AI査定を試す
            </Link>
            <Link
              href="/properties/new"
              className="px-8 py-4 border border-white text-white text-sm font-medium hover:bg-white hover:text-gray-900 transition-colors"
            >
              物件を登録する
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400 mb-4">お電話でのご相談も受け付けております</p>
            <a
              href="tel:0120-962-658"
              className="flex items-center justify-center gap-3 text-2xl font-light"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              0120-962-658
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
