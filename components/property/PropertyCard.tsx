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

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100">
        <div className="relative h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {firstImage ? (
            <img
              src={firstImage}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
            {property.title}
          </h3>
          <div className="mb-3">
            <p className="text-2xl font-bold text-blue-600">
              ¥{property.price.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1.5 mb-3">
            <p className="text-sm text-gray-700 font-medium">
              📍 {property.prefecture} {property.city}
            </p>
            {property.nearestStation && (
              <p className="text-sm text-gray-600 flex items-center">
                <span className="mr-1">🚃</span>
                {property.nearestStation}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        </div>
      </div>
    </Link>
  )
}

