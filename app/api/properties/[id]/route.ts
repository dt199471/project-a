import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    })

    if (!property) {
      return NextResponse.json(
        { error: "物件が見つかりません" },
        { status: 404 }
      )
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error fetching property:", error)
    return NextResponse.json(
      { error: "物件の取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      )
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id },
    })

    if (!property) {
      return NextResponse.json(
        { error: "物件が見つかりません" },
        { status: 404 }
      )
    }

    if (property.userId !== session.user.id) {
      return NextResponse.json(
        { error: "この物件を編集する権限がありません" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, price, address, city, prefecture, nearestStation, images } = body

    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: {
        title: title || property.title,
        description: description || property.description,
        price: price ? parseInt(price) : property.price,
        address: address || property.address,
        city: city || property.city,
        prefecture: prefecture || property.prefecture,
        nearestStation: nearestStation !== undefined ? nearestStation : (property as any).nearestStation,
        images: images ? JSON.stringify(images) : property.images,
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

    return NextResponse.json(updatedProperty)
  } catch (error) {
    console.error("Error updating property:", error)
    return NextResponse.json(
      { error: "物件の更新に失敗しました" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      )
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id },
    })

    if (!property) {
      return NextResponse.json(
        { error: "物件が見つかりません" },
        { status: 404 }
      )
    }

    if (property.userId !== session.user.id) {
      return NextResponse.json(
        { error: "この物件を削除する権限がありません" },
        { status: 403 }
      )
    }

    await prisma.property.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "物件を削除しました" })
  } catch (error) {
    console.error("Error deleting property:", error)
    return NextResponse.json(
      { error: "物件の削除に失敗しました" },
      { status: 500 }
    )
  }
}


