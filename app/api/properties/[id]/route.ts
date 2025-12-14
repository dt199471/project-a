import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const property = await prisma.property.findUnique({
      where: { id },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const property = await prisma.property.findUnique({
      where: { id },
    })

    if (!property) {
      return NextResponse.json(
        { error: "物件が見つかりません" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { title, description, price, address, city, prefecture, nearestStation, buildYear, buildMonth, layout, area, images } = body

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        title: title || property.title,
        description: description || property.description,
        price: price ? parseInt(price) : property.price,
        address: address || property.address,
        city: city || property.city,
        prefecture: prefecture || property.prefecture,
        nearestStation: nearestStation !== undefined ? nearestStation : (property as any).nearestStation,
        buildYear: buildYear !== undefined ? (buildYear ? parseInt(buildYear) : null) : (property as any).buildYear,
        buildMonth: buildMonth !== undefined ? (buildMonth ? parseInt(buildMonth) : null) : (property as any).buildMonth,
        layout: layout !== undefined ? (layout || null) : (property as any).layout,
        area: area !== undefined ? (area ? parseFloat(area) : null) : (property as any).area,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const property = await prisma.property.findUnique({
      where: { id },
    })

    if (!property) {
      return NextResponse.json(
        { error: "物件が見つかりません" },
        { status: 404 }
      )
    }

    await prisma.property.delete({
      where: { id },
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


