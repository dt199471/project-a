interface PropertySummaryCardProps {
  property: {
    title: string
    price: number
    prefecture: string
    city: string
    address: string
    images: string
  }
  buildYear?: number | null
  buildMonth?: number | null
  layout?: string | null
  area?: number | null
}

export default function PropertySummaryCard({ property, buildYear, buildMonth, layout, area }: PropertySummaryCardProps) {
  const images = property.images ? JSON.parse(property.images) : []
  const firstImage = images[0]

  // 築年月を計算
  let buildDate = null
  if (buildYear) {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    let years = currentYear - buildYear
    let months = 0
    
    if (buildMonth) {
      months = currentMonth - buildMonth
      if (months < 0) {
        years -= 1
        months += 12
      }
      buildDate = `${buildYear}年${buildMonth}月（${years}年${months > 0 ? `${months}ヶ月` : ''}）`
    } else {
      buildDate = `${buildYear}年築（${years}年）`
    }
  }

  return (
    <div className="bg-white border border-gray-200 shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* 画像セクション */}
        <div className="relative h-96 lg:h-auto bg-gray-100 overflow-hidden">
          {firstImage ? (
            <img
              src={firstImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* 物件情報セクション */}
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-light text-gray-900 mb-6 leading-relaxed">
            {property.title}
          </h2>

          <div className="space-y-4">
            <div className="flex pb-4">
              <dt className="w-32 text-sm text-gray-600">販売価格</dt>
              <dd className="flex-1 text-lg font-light text-gray-900">
                {property.price.toLocaleString()}万円
              </dd>
            </div>

            {buildDate && (
              <div className="flex pb-4">
                <dt className="w-32 text-sm text-gray-600">築年月</dt>
                <dd className="flex-1 text-sm text-gray-900">{buildDate}</dd>
              </div>
            )}

            <div className="flex pb-4">
              <dt className="w-32 text-sm text-gray-600">所在地</dt>
              <dd className="flex-1 text-sm text-gray-900">
                {property.prefecture}{property.city}{property.address}
              </dd>
            </div>

            {(layout || area) && (
              <div className="flex pb-4">
                <dt className="w-32 text-sm text-gray-600">間取り</dt>
                <dd className="flex-1 text-sm text-gray-900">
                  {layout && <span>{layout}</span>}
                  {layout && area && <span> / </span>}
                  {area && <span>{area}m² 〜 {(area * 1.8).toFixed(2)}m²</span>}
                </dd>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
