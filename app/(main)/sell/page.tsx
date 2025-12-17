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
              売る
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              物件所有のオーナー様へ
            </p>
          </div>
        </div>
      </div>

      {/* Owner Actions Section */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link
              href="/ai-estimator"
              className="group p-8 border border-gray-200 hover:border-gray-900 transition-colors"
            >
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">CONSULTATION</p>
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  とりあえず売却や管理の相談をしたい方
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  売却・賃料査定の相談
                </p>
              </div>
              <div className="flex items-center text-gray-900 group-hover:text-gray-700 transition-colors">
                <span className="text-sm font-medium">詳しく見る</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <Link
              href="/ai-estimator"
              className="group p-8 border border-gray-200 hover:border-gray-900 transition-colors"
            >
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">AI ESTIMATION</p>
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  手軽にマンションの推定相場を知りたい方
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  AI売却/賃料査定
                </p>
              </div>
              <div className="flex items-center text-gray-900 group-hover:text-gray-700 transition-colors">
                <span className="text-sm font-medium">詳しく見る</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* AI Estimation Feature Section */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              推定売却価格・推定賃料が<br />瞬時にオンラインでわかる
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              無料会員登録後、ご所有の物件を登録することで瞬時に売却推定価格・推定賃料のAI査定結果が確認できます。また、登録した月から毎月の推移も確認できます。
            </p>
            <Link
              href="/ai-estimator"
              className="inline-block px-8 py-4 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              詳しくはこちら
            </Link>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest uppercase mb-4 text-gray-500">WHY CHOOSE US</p>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
              Selfie Homeの売却が選ばれる理由
            </h2>
          </div>

          {/* Reason 1: 高く売れるから */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl lg:text-3xl font-light text-gray-900 mb-4">
                1高く売れるから
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                オープンな集客活動とテクノロジーによる透明性担保
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h4 className="text-xl font-medium text-gray-900 mb-4">
                  囲い込みをせずに、<br />オープンに集客します
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  広告効果を最大化するために、自社の購入顧客を優先するのではなく、売主様に良い購入オファーが来る可能性を最大限に高める集客活動を行なっています。
                </p>
                <div className="bg-gray-50 p-6 border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">注意</p>
                  <p className="text-sm text-gray-600">
                    不動産業界で続く慣習「囲い込み」とは、売主様と買主様の双方から手数料を取るため他社からの問い合わせを受け付けないことです。
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-8 border border-gray-200">
                <h4 className="text-xl font-medium text-gray-900 mb-4">
                  囲い込み防止のための<br />透明化システム
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  囲い込みを防ぐために、全ての内見依頼・資料請求・広告掲載依頼をリアルタイムで売主様が確認できる弊社独自のシステムがございます。
                </p>
              </div>
            </div>
          </div>

          {/* Reason 2: 早く売れるから */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl lg:text-3xl font-light text-gray-900 mb-4">
                2早く売れるから
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                業界トップ水準の都心高級不動産プラットフォーム
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h4 className="text-xl font-medium text-gray-900 mb-4">
                  トップクラスの<br />都心高級不動産サイト
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  売却の仲介だけでなく、Selfie Homeでは賃貸管理も行なっているため、売却価格・家賃収入をシミュレーションした上で、オーナー様にとって納得のいく選択をしていただけます。
                </p>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-900 mb-4">
                  競争意識を働かせる<br />予約制オープンルーム
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  売主様の物件を見学する際に、複数の買主様候補を同時に集め説明をすることで、競争意識が働きより一層売却のスピードが早くなります。
                </p>
              </div>
            </div>
          </div>

          {/* Reason 3: 全て任せられるから */}
          <div>
            <div className="text-center mb-12">
              <h3 className="text-2xl lg:text-3xl font-light text-gray-900 mb-4">
                3全て任せられるから
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                賃貸・購入・売却・賃貸管理すべて弊社で対応可能
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h4 className="text-xl font-medium text-gray-900 mb-4">
                  売却か貸し出しか<br />比較して判断可能
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  賃貸管理も行なっている当社では、売却価格・家賃収入の両方をシミュレーションした上で、納得のいく選択をしていただけます。
                </p>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-900 mb-4">
                  お住み替えの場合は<br />購入・賃貸物件の紹介可能
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  お住み替えについては、ご売却と並行して購入物件や賃貸物件をご提案させていただき、新しい住まいへのスムーズな入居を実現いたします。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Selling Features Section */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest uppercase mb-4 text-gray-500">FEATURES</p>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
              Selfie Homeのスマートな売却の特徴
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-6">
                物件の魅力最大化
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    買主様の目に留まる<br />専属デザイナーが作成する物件資料
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    お住み替えについては、ご売却と並行して購入物件や賃貸物件をご提案させていただき、新しい住まいへのスムーズな入居を実現いたします。
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    静止画や空室画像以外でのアプローチ
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    最大360度臨場感溢れるパノラマコンテンツを撮影し、バーチャル内見（3Dウォークスルー）を実現します。
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-6">
                充実のサポート体制
              </h3>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  客観的に売却活動の進捗を<br />確認できる数字を基にした戦略レポート
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  定量的な数字をベースに販売進捗をご報告します。販売方針の見直しが必要な場合も、客観的な指標を元にご提案いたします。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest uppercase mb-4 text-gray-500">PROCESS</p>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
              物件売却の流れ
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Selfie Homeで不動産（マンション・戸建）売却する流れを紹介します。<br />
              住み替えの場合は、同時に新たなお住まいのご提案をいたします。
            </p>
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

      {/* Customer Reviews Section */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest uppercase mb-4 text-gray-500">TESTIMONIALS</p>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
              お客様の声
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Selfie Homeの売却を利用した方にアンケートを実施しました。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">5.0</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">40代女性</p>
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                担当エージェントについて
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                途中から、担当エージェントさんにほぼ決めていて、「この人は売る」と直感で思いました。ある意味自分の子供のように、すごく信頼しています。
              </p>
              <h4 className="text-lg font-medium text-gray-900 mb-3">コメント</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                正直、内見1回で決まったので、Selfie Homeの売却の良いところをすべて感じないまま、売却活動が終わりました。担当エージェントの方や室内撮影いただいたカメラマンの方もすごく良い方でした。
              </p>
            </div>
            <div className="bg-white p-8 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(4)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">4.5</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">40代男性</p>
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                担当エージェントについて
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                若くてエネルギーに溢れスピード感があり、一緒に動いてくれて大変助かった。
              </p>
              <h4 className="text-lg font-medium text-gray-900 mb-3">コメント</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                始めは売れるか不安もありましたが、担当エージェントのスピード感のある対応と、テクノロジーを駆使した革新的なアプローチで、いい買い主様との出会いが実現できてよかったです。自分たちが大切にしてきた物件なので、それを同じように取り扱ってくれた担当エージェントに感謝しています。
              </p>
            </div>
            <div className="bg-white p-8 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">5.0</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">50代男性</p>
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                担当エージェントについて
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                色々アドバイスしてもらい、手続き等も骨折りしてもらいました。
              </p>
              <h4 className="text-lg font-medium text-gray-900 mb-3">コメント</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                今回知人の紹介でSelfie Homeの売却サービスのことを知り、保有物件をお任せしましたが、思ったよりもスムーズに売却できました。ありがとうございました。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Registration CTA Section */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 border border-gray-200 p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              オーナー登録すると、<br />お持ちのマンションの資産価値が<br />毎月把握できます
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
              <div className="bg-white p-6 border border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">売却・賃料査定</p>
              </div>
              <div className="bg-white p-6 border border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">マンション過去6ヶ月のトレンド</p>
              </div>
            </div>
            <Link
              href="/ai-estimator"
              className="inline-block px-8 py-4 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              かんたんAI売却/賃料査定はこちら
            </Link>
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
