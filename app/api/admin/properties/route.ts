import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!adminUser?.isAdmin) {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 })
    }

    const properties = await prisma.property.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        address: true,
        city: true,
        prefecture: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            loginId: true,
            name: true,
          },
        },
        _count: {
          select: {
            messages: true,
            favorites: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // BigIntをstringに変換
    const serializedProperties = properties.map((p) => ({
      ...p,
      price: p.price.toString(),
    }))

    return NextResponse.json(serializedProperties)
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json(
      { error: "物件一覧の取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!adminUser?.isAdmin) {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 })
    }

    if (!propertyId) {
      return NextResponse.json({ error: "物件IDが必要です" }, { status: 400 })
    }

    await prisma.property.delete({
      where: { id: propertyId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting property:", error)
    return NextResponse.json(
      { error: "物件の削除に失敗しました" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const body = await request.json()
    const { propertyId, status } = body

    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!adminUser?.isAdmin) {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 })
    }

    if (!propertyId) {
      return NextResponse.json({ error: "物件IDが必要です" }, { status: 400 })
    }

    const validStatuses = ["ACTIVE", "NEGOTIATING", "SOLD", "DRAFT"]
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "無効なステータスです" }, { status: 400 })
    }

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: { status },
    })

    return NextResponse.json({
      ...updatedProperty,
      price: updatedProperty.price.toString(),
    })
  } catch (error) {
    console.error("Error updating property:", error)
    return NextResponse.json(
      { error: "物件の更新に失敗しました" },
      { status: 500 }
    )
  }
}
