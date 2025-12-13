import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const propertyId = searchParams.get("propertyId")
    const userId = searchParams.get("userId")

    if (!propertyId || !userId) {
      return NextResponse.json({ isFavorite: false })
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    })

    return NextResponse.json({ isFavorite: !!favorite })
  } catch (error) {
    console.error("Error checking favorite:", error)
    return NextResponse.json({ isFavorite: false })
  }
}



