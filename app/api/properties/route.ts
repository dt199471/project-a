import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const city = searchParams.get("city")
    const prefecture = searchParams.get("prefecture")
    const nearestStation = searchParams.get("nearestStation")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { address: { contains: search } },
      ]
    }

    if (nearestStation) {
      where.nearestStation = { contains: nearestStation }
    }

    if (minPrice) {
      where.price = { ...where.price, gte: parseInt(minPrice) }
    }

    if (maxPrice) {
      where.price = { ...where.price, lte: parseInt(maxPrice) }
    }

    if (city) {
      where.city = city
    }

    if (prefecture) {
      where.prefecture = prefecture
    }

    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const properties = await prisma.property.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json(
      { error: "物件の取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, price, address, city, prefecture, nearestStation, images } = body

    if (!title || !description || !price || !address || !city || !prefecture) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      )
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: parseInt(price),
        address,
        city,
        prefecture,
        nearestStation: nearestStation || null,
        images: JSON.stringify(images || []),
        userId: session.user.id,
      } as any,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error("Error creating property:", error)
    return NextResponse.json(
      { error: "物件の登録に失敗しました" },
      { status: 500 }
    )
  }
}


