import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    const favorites = await prisma.favorite.findMany({
      where: userId ? { userId } : {},
      include: {
        property: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(favorites)
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json(
      { error: "お気に入りの取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { propertyId, userId } = body


    if (!propertyId) {
      return NextResponse.json(
        { error: "物件IDが必要です" },
        { status: 400 }
      )
    }

    const finalUserId = userId || "default-user"
    
    // Check if user exists, create if not
    let userExists = await prisma.user.findUnique({where:{id:finalUserId}}).catch(()=>null);
    
    if (!userExists) {
      userExists = await prisma.user.upsert({
        where: { id: finalUserId },
        update: {},
        create: {
          id: finalUserId,
          loginId: `user_${finalUserId}`,
          name: "デフォルトユーザー",
          email: null,
        },
      })
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: finalUserId,
        propertyId,
      },
      include: {
        property: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })


    return NextResponse.json(favorite, { status: 201 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "既にお気に入りに追加されています" },
        { status: 409 }
      )
    }
    console.error("Error creating favorite:", error)
    return NextResponse.json(
      { error: "お気に入りの追加に失敗しました" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const propertyId = searchParams.get("propertyId")
    const userId = searchParams.get("userId")

    if (!propertyId) {
      return NextResponse.json(
        { error: "物件IDが必要です" },
        { status: 400 }
      )
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: userId || "default-user",
        propertyId,
      },
    })

    return NextResponse.json({ message: "お気に入りを削除しました" })
  } catch (error) {
    console.error("Error deleting favorite:", error)
    return NextResponse.json(
      { error: "お気に入りの削除に失敗しました" },
      { status: 500 }
    )
  }
}




