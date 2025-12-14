"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
]

interface PropertyFormProps {
  property?: {
    id: string
    title: string
    description: string
    price: number
    address: string
    city: string
    prefecture: string
    nearestStation?: string | null
    buildYear?: number | null
    buildMonth?: number | null
    layout?: string | null
    area?: number | null
    images: string
  }
}

export default function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    price: property?.price.toString() || "",
    address: property?.address || "",
    city: property?.city || "",
    prefecture: property?.prefecture || "",
    nearestStation: (property as any)?.nearestStation || "",
    buildYear: property?.buildYear?.toString() || "",
    buildMonth: property?.buildMonth?.toString() || "",
    layout: property?.layout || "",
    area: property?.area?.toString() || "",
    images: property?.images ? JSON.parse(property.images) : [] as string[],
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImageFiles(files)
      const imageUrls = files.map((file) => URL.createObjectURL(file))
      setFormData({
        ...formData,
        images: [...formData.images, ...imageUrls],
      })
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_: string, i: number) => i !== index)
    setFormData({ ...formData, images: newImages })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 画像をアップロード（簡易版：base64エンコード）
      const uploadedImages: string[] = []
      for (const file of imageFiles) {
        const reader = new FileReader()
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
        uploadedImages.push(base64)
      }

      const payload = {
        ...formData,
        images: uploadedImages.length > 0 ? uploadedImages : formData.images,
      }

      const url = property
        ? `/api/properties/${property.id}`
        : "/api/properties"
      const method = property ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/properties/${data.id}`)
      } else {
        const error = await response.json()
        alert(error.error || "登録に失敗しました")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("登録に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200">
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="例: 渋谷駅徒歩5分 リノベーション済み 2LDK"
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            説明 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={8}
            placeholder="物件の特徴や魅力を具体的にご記入ください"
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            価格（円） <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            placeholder="30000000"
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
          />
          <p className="mt-2 text-sm text-gray-500">
            AI査定を参考に適正価格を設定することをおすすめします
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              都道府県 <span className="text-red-500">*</span>
            </label>
            <select
              name="prefecture"
              value={formData.prefecture}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white"
            >
              <option value="">選択してください</option>
              {PREFECTURES.map((pref) => (
                <option key={pref} value={pref}>
                  {pref}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              市区町村 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="例: 渋谷区"
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            住所 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="例: 神南1-2-3"
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            最寄り駅
          </label>
          <input
            type="text"
            name="nearestStation"
            value={formData.nearestStation}
            onChange={handleChange}
            placeholder="例: JR山手線 渋谷駅 徒歩5分"
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              築年
            </label>
            <input
              type="number"
              name="buildYear"
              value={formData.buildYear}
              onChange={handleChange}
              placeholder="例: 2015"
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              築月
            </label>
            <select
              name="buildMonth"
              value={formData.buildMonth}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white"
            >
              <option value="">選択してください</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {month}月
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              間取り
            </label>
            <input
              type="text"
              name="layout"
              value={formData.layout}
              onChange={handleChange}
              placeholder="例: 3LDK"
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              専有面積（㎡）
            </label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="例: 60.5"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            画像
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-800 file:cursor-pointer"
          />
          <p className="mt-2 text-sm text-gray-500">
            明るく清潔感のある写真を複数枚登録すると、購入希望者の目に留まりやすくなります
          </p>
          {formData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((img: string, index: number) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-gray-900 text-white w-6 h-6 flex items-center justify-center text-sm hover:bg-gray-800 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? "送信中..." : property ? "更新する" : "登録する"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 border border-gray-300 text-gray-900 hover:bg-gray-50 font-medium transition-colors"
          >
            キャンセル
          </button>
        </div>
      </div>
    </form>
  )
}


