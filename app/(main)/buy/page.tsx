"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function BuyPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
            理想の住まいを<br />
            <span className="text-gray-300">自分の手で見つける</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            仲介手数料なしで、直接売主とつながる。
            Selfie Homeなら、気軽に、安心に、あなたの家を見つけられます。
          </p>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/properties"
              className="group bg-gray-900 p-8 hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">SEARCH</p>
                  <h3 className="text-xl font-medium text-white mb-2">物件を探す</h3>
                  <p className="text-sm text-gray-400">
                    条件に合った物件を検索
                  </p>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <Link
              href="/favorites"
              className="group bg-white p-8 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">FAVORITES</p>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">お気に入り物件</h3>
                  <p className="text-sm text-gray-500">
                    保存した物件を確認
                  </p>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-light text-gray-900 mb-12 text-center">
          Selfie Homeで購入するメリット
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">仲介手数料0円</h3>
            <p className="text-sm text-gray-600">
              個人間売買だから、仲介手数料は一切かかりません。
              物件価格のみでお得に購入。
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">直接コミュニケーション</h3>
            <p className="text-sm text-gray-600">
              売主と直接メッセージでやり取り。
              物件の詳細を気軽に質問できます。
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">厳選された物件</h3>
            <p className="text-sm text-gray-600">
              質の高い物件のみを掲載。
              安心して物件探しができます。
            </p>
          </div>
        </div>

        {/* Search by Section */}
        <div className="border-t border-gray-200 pt-16 mb-16">
          <h2 className="text-2xl font-light text-gray-900 mb-12 text-center">
            物件を探す
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/properties?filterType=area"
              className="group p-6 border border-gray-200 hover:border-gray-900 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">SEARCH BY</p>
                  <h3 className="text-lg font-medium text-gray-900">エリアから探す</h3>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <Link
              href="/properties?filterType=station"
              className="group p-6 border border-gray-200 hover:border-gray-900 transition-colors"
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
              href="/properties?filterType=price"
              className="group p-6 border border-gray-200 hover:border-gray-900 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">SEARCH BY</p>
                  <h3 className="text-lg font-medium text-gray-900">価格から探す</h3>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* Steps Section */}
        <div className="border-t border-gray-200 pt-16 mb-16">
          <h2 className="text-2xl font-light text-gray-900 mb-12 text-center">
            購入までの流れ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-900 text-white font-medium mb-4">
                1
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">物件を探す</h3>
              <p className="text-sm text-gray-600">
                条件を入力して理想の物件を検索
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-900 text-white font-medium mb-4">
                2
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">売主に問い合わせ</h3>
              <p className="text-sm text-gray-600">
                気になる物件にメッセージを送信
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-900 text-white font-medium mb-4">
                3
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">内見・交渉</h3>
              <p className="text-sm text-gray-600">
                直接やり取りして条件を調整
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-900 text-white font-medium mb-4">
                4
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">契約・引渡し</h3>
              <p className="text-sm text-gray-600">
                契約手続きを経て購入完了
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 border border-gray-200 p-12 text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            今すぐ物件を探しましょう
          </h2>
          <p className="text-gray-600 mb-8">
            会員登録でお気に入り保存やメッセージ機能が使えます
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 font-light transition-colors"
            >
              物件を探す
            </Link>
            {!user && (
              <Link
                href="/auth"
                className="px-8 py-4 bg-white text-gray-900 border border-gray-900 hover:bg-gray-50 font-light transition-colors"
              >
                会員登録する
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Popular Areas Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-light text-gray-900 mb-12 text-center">
            人気エリア
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "渋谷区", "港区", "目黒区", "世田谷区",
              "千代田区", "中央区", "新宿区", "品川区"
            ].map((area) => (
              <Link
                key={area}
                href={`/properties?city=${area}`}
                className="group p-4 bg-white border border-gray-200 hover:border-gray-900 transition-colors text-center"
              >
                <span className="text-sm font-medium text-gray-900">{area}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-light text-gray-900 mb-12 text-center">
            よくある質問
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-2">
                本当に仲介手数料は無料ですか？
              </h3>
              <p className="text-sm text-gray-600">
                はい、Selfie Homeは個人間売買プラットフォームのため、仲介手数料は一切かかりません。
                物件価格のみで購入できます。
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-2">
                契約手続きはどうすればいいですか？
              </h3>
              <p className="text-sm text-gray-600">
                売買契約は司法書士や弁護士にご依頼いただくことをお勧めします。
                必要に応じて専門家をご紹介することも可能です。
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-2">
                物件の内見はできますか？
              </h3>
              <p className="text-sm text-gray-600">
                メッセージ機能で売主に直接連絡して、内見の日程調整ができます。
                売主と直接やり取りするため、スムーズに内見が可能です。
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-2">
                住宅ローンは使えますか？
              </h3>
              <p className="text-sm text-gray-600">
                個人間売買でも住宅ローンの利用は可能です。ただし、金融機関によって条件が異なりますので、
                事前に金融機関にご相談ください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



