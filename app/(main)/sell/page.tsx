"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function SellPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
            あなたの不動産を<br />
            <span className="text-gray-300">自分の手で売却</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            仲介手数料なしで、直接買い手とつながる。
            Selfie Homeなら、気軽に、安心に、あなたの家を売却できます。
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-light text-gray-900 mb-12 text-center">
          Selfie Homeで売却するメリット
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
              売却価格をそのまま手元に。
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI価格査定</h3>
            <p className="text-sm text-gray-600">
              AIが市場データを分析し、適正価格をご提案。
              自信を持って価格設定できます。
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
              買い手と直接メッセージでやり取り。
              スムーズな交渉を実現します。
            </p>
          </div>
        </div>

        {/* Steps Section */}
        <div className="border-t border-gray-200 pt-16 mb-16">
          <h2 className="text-2xl font-light text-gray-900 mb-12 text-center">
            売却までの流れ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-900 text-white font-medium mb-4">
                1
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">物件情報を登録</h3>
              <p className="text-sm text-gray-600">
                物件の基本情報、写真、価格を入力して登録
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-900 text-white font-medium mb-4">
                2
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">買い手からの問い合わせ</h3>
              <p className="text-sm text-gray-600">
                興味を持った買い手からメッセージが届きます
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-900 text-white font-medium mb-4">
                3
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">交渉・内見</h3>
              <p className="text-sm text-gray-600">
                直接やり取りして条件を調整
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-900 text-white font-medium mb-4">
                4
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">成約</h3>
              <p className="text-sm text-gray-600">
                契約手続きを経て売却完了
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 border border-gray-200 p-12 text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            今すぐ物件を登録しましょう
          </h2>
          <p className="text-gray-600 mb-8">
            登録は無料。まずはAI査定で適正価格を確認することもできます。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                href="/properties/new"
                className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 font-light transition-colors"
              >
                物件を登録する
              </Link>
            ) : (
              <Link
                href="/auth"
                className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 font-light transition-colors"
              >
                ログインして登録する
              </Link>
            )}
            <Link
              href="/ai-estimator"
              className="px-8 py-4 bg-white text-gray-900 border border-gray-900 hover:bg-gray-50 font-light transition-colors"
            >
              まずはAI査定を試す
            </Link>
          </div>
        </div>

        {/* Business CTA */}
        <div className="mt-8 border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-gray-900 text-white text-xs">業者様向け</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">不動産業者の方へ</h3>
              <p className="text-sm text-gray-600 mt-1">
                複数物件の一括管理、反響分析など業者様向け機能をご利用いただけます。
              </p>
            </div>
            <Link
              href="/sell/business"
              className="px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-light transition-colors whitespace-nowrap"
            >
              業者向けページへ
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-light text-gray-900 mb-12 text-center">
            よくある質問
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-2">
                本当に仲介手数料は無料ですか？
              </h3>
              <p className="text-sm text-gray-600">
                はい、Selfie Homeは個人間売買プラットフォームのため、仲介手数料は一切かかりません。
                物件登録も無料です。
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-2">
                契約手続きはどうすればいいですか？
              </h3>
              <p className="text-sm text-gray-600">
                売買契約は司法書士や弁護士にご依頼いただくことをお勧めします。
                必要に応じて専門家をご紹介することも可能です。
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-2">
                価格はどう決めればいいですか？
              </h3>
              <p className="text-sm text-gray-600">
                AI査定機能で市場価格の目安を確認できます。
                周辺の取引事例なども参考にしながら、適正価格を設定してください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
