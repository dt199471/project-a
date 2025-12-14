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
    images: string
    user: {
      name: string | null
      image: string | null
    }
  }
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const images = property.images ? JSON.parse(property.images) : []
  const firstImage = images[0]

  // 築年数を計算（createdAtから）
  const createdAt = new Date()
  const buildYear = createdAt.getFullYear() - Math.floor(Math.random() * 30 + 5) // モック: 5-35年前
  const buildDate = `${buildYear}年築`
  
  // 間取りをdescriptionから抽出（モック: 2LDK, 3LDKなど）
  const layoutMatch = property.description.match(/(\d+LDK|\d+K|\d+DK)/i)
  const layout = layoutMatch ? layoutMatch[1] : null

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="group bg-white border border-gray-200 hover:border-gray-900 transition-colors overflow-hidden">
        <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
          {firstImage ? (
            <img
              src={firstImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2">
            {property.title}
          </h3>
          <p className="text-lg font-light text-gray-900 mb-2">
            ¥{property.price.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mb-1">
            {buildDate}
          </p>
          {layout && (
            <p className="text-xs text-gray-600 mb-2">
              {layout}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
