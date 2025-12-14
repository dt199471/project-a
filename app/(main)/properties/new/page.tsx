"use client"

import PropertyForm from "@/components/property/PropertyForm"

export default function NewPropertyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-sm tracking-widest uppercase mb-4 text-gray-500">REGISTER PROPERTY</p>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
            物件を登録する
          </h1>
          <p className="text-gray-600 leading-relaxed">
            物件情報を入力して公開してください。写真や詳細情報を充実させることで、<br className="hidden lg:block" />
            より多くの購入希望者の目に留まりやすくなります。
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PropertyForm />
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-medium text-gray-900 mb-6">登録のポイント</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">📸 写真</h3>
              <p className="text-sm text-gray-600">
                明るく清潔感のある写真を複数枚登録しましょう
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">📝 詳細情報</h3>
              <p className="text-sm text-gray-600">
                物件の特徴や魅力を具体的に記載しましょう
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">💰 適正価格</h3>
              <p className="text-sm text-gray-600">
                AI査定を参考に、適正な価格を設定しましょう
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
