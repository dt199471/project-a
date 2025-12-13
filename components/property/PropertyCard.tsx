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
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-48 w-full bg-gray-200">
          {firstImage ? (
            <img
              src={firstImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              画像なし
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {property.title}
          </h3>
          <p className="text-2xl font-bold text-indigo-600 mb-2">
            ¥{property.price.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            {property.prefecture} {property.city}
          </p>
          {property.nearestStation && (
            <p className="text-sm text-gray-500 mb-2">
              🚃 {property.nearestStation}
            </p>
          )}
          <p className="text-sm text-gray-500 line-clamp-2">
            {property.description}
          </p>
        </div>
      </div>
    </Link>
  )
}

