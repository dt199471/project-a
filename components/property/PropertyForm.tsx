"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
]

const STRUCTURES = [
  "木造",
  "鉄骨造",
  "鉄筋コンクリート造（RC）",
  "鉄骨鉄筋コンクリート造（SRC）",
  "軽量鉄骨造",
  "その他"
]

const DIRECTIONS = [
  "北", "北東", "東", "南東", "南", "南西", "西", "北西"
]

const LAYOUTS = [
  "1R", "1K", "1DK", "1LDK",
  "2K", "2DK", "2LDK",
  "3K", "3DK", "3LDK",
  "4K", "4DK", "4LDK",
  "5K以上"
]

const STATUSES = [
  { value: "ACTIVE", label: "公開中" },
  { value: "NEGOTIATING", label: "交渉中" },
  { value: "SOLD", label: "成約済み" },
  { value: "DRAFT", label: "下書き" },
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
    structure?: string | null
    floor?: number | null
    totalFloors?: number | null
    direction?: string | null
    parking?: boolean
    petAllowed?: boolean
    managementFee?: number | null
    repairReserve?: number | null
    renovationHistory?: string | null
    status?: string
    images: string
  }
}

export default function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [photoAiLoading, setPhotoAiLoading] = useState<"sort" | "comment" | "floorplan" | null>(null)
  const [mansionName, setMansionName] = useState("")
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
    structure: property?.structure || "",
    floor: property?.floor?.toString() || "",
    totalFloors: property?.totalFloors?.toString() || "",
    direction: property?.direction || "",
    parking: property?.parking || false,
    petAllowed: property?.petAllowed || false,
    managementFee: property?.managementFee?.toString() || "",
    repairReserve: property?.repairReserve?.toString() || "",
    renovationHistory: property?.renovationHistory || "",
    status: property?.status || "ACTIVE",
    images: property?.images ? JSON.parse(property.images) : [] as string[],
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [pamphletLoading, setPamphletLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      // 既存のファイルに新しいファイルを追加
      setImageFiles(prevFiles => [...prevFiles, ...files])
      
      // プレビュー用のURLを作成して追加
      const imageUrls = files.map((file) => URL.createObjectURL(file))
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }))
    }
  }

  const removeImage = (index: number) => {
    // 新しく追加したファイルも同期して削除
    const existingImagesCount = property?.images ? JSON.parse(property.images).length : 0
    if (index >= existingImagesCount) {
      // 新しく追加した画像の場合、imageFilesからも削除
      const fileIndex = index - existingImagesCount
      setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== fileIndex))
    }

    const newImages = formData.images.filter((_: string, i: number) => i !== index)
    setFormData({ ...formData, images: newImages })
  }

  // 写真を自動で並び替え
  const handlePhotoSort = async () => {
    if (formData.images.length < 2) {
      alert("並び替えには2枚以上の画像が必要です")
      return
    }

    setPhotoAiLoading("sort")
    try {
      const response = await fetch("/api/ai/photo-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: formData.images,
          action: "sort",
        }),
      })

      const result = await response.json()

      if (result.success && result.sortedIndices) {
        const sortedImages = result.sortedIndices.map((i: number) => formData.images[i])
        setFormData(prev => ({ ...prev, images: sortedImages }))
        alert("写真を最適な順序に並び替えました！（外観→リビング→キッチン→寝室→...）")
      } else {
        alert(result.error || "並び替えに失敗しました")
      }
    } catch (error) {
      console.error("Photo sort error:", error)
      alert("並び替え中にエラーが発生しました")
    } finally {
      setPhotoAiLoading(null)
    }
  }

  // 写真からコメントを自動生成
  const handlePhotoComment = async () => {
    if (formData.images.length === 0) {
      alert("コメント生成には画像が必要です")
      return
    }

    setPhotoAiLoading("comment")
    try {
      const response = await fetch("/api/ai/photo-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: formData.images,
          action: "comment",
        }),
      })

      const result = await response.json()

      if (result.success && result.comment) {
        const currentDesc = formData.description
        const newDesc = currentDesc
          ? `${currentDesc}\n\n【AIが生成した説明】\n${result.comment}`
          : result.comment
        setFormData(prev => ({ ...prev, description: newDesc }))
        alert("写真から説明文を生成しました！")
      } else {
        alert(result.error || "コメント生成に失敗しました")
      }
    } catch (error) {
      console.error("Photo comment error:", error)
      alert("コメント生成中にエラーが発生しました")
    } finally {
      setPhotoAiLoading(null)
    }
  }

  // パンフレットから間取り情報を抽出
  const handleFloorPlanExtract = async () => {
    if (formData.images.length === 0) {
      alert("間取り図の画像をアップロードしてください")
      return
    }

    setPhotoAiLoading("floorplan")
    try {
      // 最初の画像で試行
      const response = await fetch("/api/ai/floor-plan-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: formData.images[0],
        }),
      })

      const result = await response.json()

      if (result.success && result.data) {
        const data = result.data
        setFormData(prev => ({
          ...prev,
          layout: data.layout || prev.layout,
          area: data.area?.toString() || prev.area,
          description: data.description
            ? `${prev.description}\n\n【間取りの特徴】\n${data.description}`
            : prev.description,
        }))
        alert("間取り情報を抽出しました！")
      } else {
        alert(result.error || "間取り情報を抽出できませんでした。間取り図の画像を選択してください。")
      }
    } catch (error) {
      console.error("Floor plan extract error:", error)
      alert("間取り抽出中にエラーが発生しました")
    } finally {
      setPhotoAiLoading(null)
    }
  }

  // AIでマンション情報を自動取得
  const handleAiAssist = async () => {
    if (!mansionName.trim()) {
      alert("マンション名を入力してください")
      return
    }

    setAiLoading(true)
    try {
      const response = await fetch("/api/ai/property-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mansionName }),
      })

      const result = await response.json()

      if (result.success && result.data) {
        const data = result.data
        setFormData(prev => ({
          ...prev,
          title: data.mansionName ? `${data.mansionName}` : prev.title,
          prefecture: data.prefecture || prev.prefecture,
          city: data.city || prev.city,
          address: data.address || prev.address,
          nearestStation: data.nearestStation || prev.nearestStation,
          buildYear: data.buildYear?.toString() || prev.buildYear,
          buildMonth: data.buildMonth?.toString() || prev.buildMonth,
          structure: data.structure || prev.structure,
          totalFloors: data.totalFloors?.toString() || prev.totalFloors,
        }))
        alert("マンション情報を取得しました！内容を確認・修正してください。")
      } else {
        alert(result.error || "情報を取得できませんでした")
      }
    } catch (error) {
      console.error("AI assist error:", error)
      alert("情報取得中にエラーが発生しました")
    } finally {
      setAiLoading(false)
    }
  }

  // パンフレット/間取り図から物件情報を自動入力
  const handlePamphletUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    setPamphletLoading(true)

    try {
      // 画像をbase64に変換
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      // AIで解析
      const response = await fetch("/api/ai/pamphlet-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      })

      const result = await response.json()

      if (result.success && result.data) {
        const data = result.data
        setFormData(prev => ({
          ...prev,
          title: data.mansionName || prev.title,
          prefecture: data.prefecture || prev.prefecture,
          city: data.city || prev.city,
          address: data.address || prev.address,
          nearestStation: data.nearestStation || prev.nearestStation,
          buildYear: data.buildYear?.toString() || prev.buildYear,
          buildMonth: data.buildMonth?.toString() || prev.buildMonth,
          layout: data.layout || prev.layout,
          area: data.area?.toString() || prev.area,
          structure: data.structure || prev.structure,
          floor: data.floor?.toString() || prev.floor,
          totalFloors: data.totalFloors?.toString() || prev.totalFloors,
          direction: data.direction || prev.direction,
          managementFee: data.managementFee?.toString() || prev.managementFee,
          repairReserve: data.repairReserve?.toString() || prev.repairReserve,
          price: data.price?.toString() || prev.price,
        }))

        // マンション名も設定
        if (data.mansionName) {
          setMansionName(data.mansionName)
        }

        alert("パンフレットから物件情報を抽出しました！内容を確認・修正してください。")
      } else {
        alert(result.error || "パンフレットから情報を抽出できませんでした")
      }
    } catch (error) {
      console.error("Pamphlet extract error:", error)
      alert("パンフレット解析中にエラーが発生しました")
    } finally {
      setPamphletLoading(false)
      // input要素をリセット
      e.target.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 既存画像を取得（base64形式で保存されているもの）
      const existingImages: string[] = formData.images.filter((img: string) => 
        img.startsWith('data:') || img.startsWith('http')
      )
      
      // 新しい画像ファイルをbase64に変換
      const newUploadedImages: string[] = []
      for (const file of imageFiles) {
        const reader = new FileReader()
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
        newUploadedImages.push(base64)
      }

      // 既存画像と新規画像を結合
      const finalImages = [...existingImages, ...newUploadedImages]

      const payload = {
        ...formData,
        images: finalImages,
        userId: user?.id,
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
        // 登録/編集後はマイページに遷移
        router.push("/mypage")
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
    <form onSubmit={handleSubmit} className="bg-white">
      <div className="space-y-8">
        {/* AI物件情報取得（新規登録時のみ） */}
        {!property && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-sm font-medium text-blue-900">AI物件情報アシスト</h3>
            </div>
            <p className="text-xs text-blue-700 mb-3">
              マンション名を入力すると、AIがインターネットから物件情報を自動取得してフォームに入力します。
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={mansionName}
                onChange={(e) => setMansionName(e.target.value)}
                placeholder="例: ブリリアタワー池袋"
                className="flex-1 px-4 py-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={handleAiAssist}
                disabled={aiLoading}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {aiLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    取得中...
                  </span>
                ) : (
                  "情報を取得"
                )}
              </button>
            </div>
          </div>
        )}

        {/* パンフレット/間取り図からの入力補助（新規登録時のみ） */}
        {!property && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-sm font-medium text-purple-900">パンフレット/間取り図から入力</h3>
            </div>
            <p className="text-xs text-purple-700 mb-3">
              マンションのパンフレットや間取り図をアップロードすると、AIが物件情報を自動で読み取りフォームに入力します。
            </p>
            <label className={`inline-flex items-center gap-2 px-4 py-2 ${pamphletLoading ? "bg-purple-300" : "bg-purple-600 hover:bg-purple-700"} text-white text-sm font-medium rounded cursor-pointer transition-colors`}>
              {pamphletLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>解析中...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>画像をアップロード</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePamphletUpload}
                disabled={pamphletLoading}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* ステータス（編集時のみ表示） */}
        {property && (
          <div className="bg-gray-50 p-4 border-b border-gray-200 -mx-0 -mt-0">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              物件ステータス
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">
              {formData.status === 'DRAFT' && '下書きは公開されません'}
              {formData.status === 'NEGOTIATING' && '交渉中の物件として表示されます'}
              {formData.status === 'SOLD' && '成約済みの物件として表示されます'}
              {formData.status === 'ACTIVE' && '現在公開中です'}
            </p>
          </div>
        )}

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
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              AI査定を参考に適正価格を設定することをおすすめします
            </p>
            <a
              href="/ai-estimate"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI査定を利用する
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
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
            <select
              name="layout"
              value={formData.layout}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white"
            >
              <option value="">選択してください</option>
              {LAYOUTS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
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

        {/* 建物情報 */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-6">建物情報</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                建物構造
              </label>
              <select
                name="structure"
                value={formData.structure}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white"
              >
                <option value="">選択してください</option>
                {STRUCTURES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                向き
              </label>
              <select
                name="direction"
                value={formData.direction}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white"
              >
                <option value="">選択してください</option>
                {DIRECTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                階数
              </label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="例: 5"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                総階数
              </label>
              <input
                type="number"
                name="totalFloors"
                value={formData.totalFloors}
                onChange={handleChange}
                placeholder="例: 15"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                管理費（円/月）
              </label>
              <input
                type="number"
                name="managementFee"
                value={formData.managementFee}
                onChange={handleChange}
                placeholder="例: 15000"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                修繕積立金（円/月）
              </label>
              <input
                type="number"
                name="repairReserve"
                value={formData.repairReserve}
                onChange={handleChange}
                placeholder="例: 10000"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="parking"
                checked={formData.parking}
                onChange={handleChange}
                className="w-5 h-5 border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm text-gray-900">駐車場あり</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="petAllowed"
                checked={formData.petAllowed}
                onChange={handleChange}
                className="w-5 h-5 border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm text-gray-900">ペット可</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              リフォーム履歴
            </label>
            <textarea
              name="renovationHistory"
              value={formData.renovationHistory}
              onChange={handleChange}
              rows={3}
              placeholder="例: 2020年 キッチン・浴室リフォーム済み"
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors resize-none"
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

          {/* 写真AI機能 */}
          {formData.images.length > 0 && (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handlePhotoSort}
                disabled={photoAiLoading !== null || formData.images.length < 2}
                className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                {photoAiLoading === "sort" ? (
                  <>
                    <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    並び替え中...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    AIで自動並び替え
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handlePhotoComment}
                disabled={photoAiLoading !== null}
                className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                {photoAiLoading === "comment" ? (
                  <>
                    <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    生成中...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    写真から説明文を生成
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleFloorPlanExtract}
                disabled={photoAiLoading !== null}
                className="px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                {photoAiLoading === "floorplan" ? (
                  <>
                    <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    抽出中...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    間取り図から情報抽出
                  </>
                )}
              </button>
            </div>
          )}

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
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </span>
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


