import Link from "next/link"

interface PropertyCardProps {
  property: {
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
    status?: string
    images: string
    user: {
      name: string | null
      image: string | null
    }
  }
}

const STATUS_LABELS: { [key: string]: { label: string; color: string } } = {
  ACTIVE: { label: "公開中", color: "bg-green-500" },
  NEGOTIATING: { label: "交渉中", color: "bg-yellow-500" },
  SOLD: { label: "成約済み", color: "bg-red-500" },
  DRAFT: { label: "下書き", color: "bg-gray-500" },
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const images = property.images ? JSON.parse(property.images) : []
  const firstImage = images[0]

  // 築年月を計算
  let buildDate = null
  if (property.buildYear) {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    let years = currentYear - property.buildYear
    let months = 0
    
    if (property.buildMonth) {
      months = currentMonth - property.buildMonth
      if (months < 0) {
        years -= 1
        months += 12
      }
      buildDate = `${property.buildYear}年${property.buildMonth}月（${years}年${months > 0 ? `${months}ヶ月` : ''}）`
    } else {
      buildDate = `${property.buildYear}年築（${years}年）`
    }
  }

  // 間取りと面積の表示
  const layoutDisplay = property.layout 
    ? property.area 
      ? `${property.layout} / ${property.area}㎡${property.area * 1.8 ? `〜${(property.area * 1.8).toFixed(2)}㎡` : ''}`
      : property.layout
    : null

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="group bg-white border border-gray-200 hover:border-gray-900 transition-all shadow-md hover:shadow-xl overflow-hidden">
        <div className="relative h-80 w-full bg-gray-100 overflow-hidden">
          {firstImage ? (
            <img
              src={firstImage}
              alt={property.title}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${property.status === 'SOLD' ? 'opacity-60' : ''}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {/* ステータスバッジ */}
          {property.status && property.status !== 'ACTIVE' && (
            <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium text-white ${STATUS_LABELS[property.status]?.color || 'bg-gray-500'}`}>
              {STATUS_LABELS[property.status]?.label || property.status}
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-lg font-light text-gray-900 mb-4 leading-relaxed line-clamp-2">
            {property.title}
          </h3>
          <p className="text-xl font-light text-gray-900 mb-3">
            {property.price.toLocaleString()}万円
          </p>
          {buildDate && (
            <p className="text-sm text-gray-600 mb-2">
              {buildDate}
            </p>
          )}
          {layoutDisplay && (
            <p className="text-sm text-gray-600">
              {layoutDisplay}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
