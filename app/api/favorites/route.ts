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

    // BigInt→Number変換（JSONシリアライゼーション対応）
    const favoritesWithNumber = favorites.map((fav: any) => ({
      ...fav,
      property: fav.property ? {
        ...fav.property,
        price: Number(fav.property.price),
      } : null,
    }))

    return NextResponse.json(favoritesWithNumber)
  } catch (error) {
    // #region agent log
    const e = error as any
    fetch('http://127.0.0.1:7242/ingest/b24b0ddd-9846-4da6-bed5-1b28613f60cf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H5',location:'app/api/favorites/route.ts:GET',message:'favorite GET error',data:{name:e?.name ?? null,message:e?.message ?? null},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
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

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b24b0ddd-9846-4da6-bed5-1b28613f60cf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3',location:'app/api/favorites/route.ts:POST',message:'favorite POST received',data:{propertyId: propertyId ?? null,userIdPresent: !!userId},timestamp:Date.now()})}).catch(()=>{});
    // #endregion


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

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b24b0ddd-9846-4da6-bed5-1b28613f60cf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3',location:'app/api/favorites/route.ts:POST',message:'favorite POST created',data:{favoriteId: favorite?.id ?? null,propertyId,finalUserId},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    // BigInt→Number変換（JSONシリアライゼーション対応）
    const favoriteWithNumber = {
      ...favorite,
      property: favorite.property ? {
        ...favorite.property,
        price: Number(favorite.property.price),
      } : null,
    }

    return NextResponse.json(favoriteWithNumber, { status: 201 })
  } catch (error: any) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b24b0ddd-9846-4da6-bed5-1b28613f60cf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H5',location:'app/api/favorites/route.ts:POST',message:'favorite POST error',data:{code:error?.code ?? null,name:error?.name ?? null,message:error?.message ?? null},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
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

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b24b0ddd-9846-4da6-bed5-1b28613f60cf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3',location:'app/api/favorites/route.ts:DELETE',message:'favorite DELETE received',data:{propertyId: propertyId ?? null,userId: userId ?? null},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

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




