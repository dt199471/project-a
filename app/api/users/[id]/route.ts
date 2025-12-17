import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        properties: {
          orderBy: { createdAt: "desc" },
          include: {
            _count: {
              select: {
                favorites: true,
                messages: true,
              },
            },
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
              include: {
                sender: {
                  select: { id: true, name: true, image: true },
                },
                receiver: {
                  select: { id: true, name: true, image: true },
                },
              },
            },
          },
        },
        _count: {
          select: {
            properties: true,
            favorites: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      )
    }

    // BigIntをNumberに変換し、お気に入り数とメッセージ数を追加
    const propertiesWithNumber = user.properties.map((p: any) => ({
      ...p,
      price: Number(p.price),
      favoriteCount: p._count.favorites,
      messageCount: p._count.messages,
      lastMessage: p.messages[0] || null,
    }))

    return NextResponse.json({
      id: user.id,
      loginId: user.loginId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
      image: user.image,
      properties: propertiesWithNumber,
      _count: user._count,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "ユーザーの取得に失敗しました" },
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
    const body = await request.json()
    const { name, email, phone, bio, image } = body

    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name !== undefined ? name : user.name,
        email: email !== undefined ? email : user.email,
        phone: phone !== undefined ? phone : user.phone,
        bio: bio !== undefined ? bio : user.bio,
        image: image !== undefined ? image : user.image,
      },
    })

    return NextResponse.json({
      id: updatedUser.id,
      loginId: updatedUser.loginId,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      image: updatedUser.image,
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "ユーザーの更新に失敗しました" },
      { status: 500 }
    )
  }
}

