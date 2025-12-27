import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // ユーザーIDをヘッダーから取得（簡易認証）
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    // 管理者チェック
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 })
    }

    // 統計情報を取得
    const [
      totalUsers,
      totalProperties,
      totalMessages,
      activeProperties,
      soldProperties,
      recentUsers,
      recentProperties,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.message.count(),
      prisma.property.count({ where: { status: "ACTIVE" } }),
      prisma.property.count({ where: { status: "SOLD" } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 過去7日
          },
        },
      }),
      prisma.property.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 過去7日
          },
        },
      }),
    ])

    return NextResponse.json({
      totalUsers,
      totalProperties,
      totalMessages,
      activeProperties,
      soldProperties,
      recentUsers,
      recentProperties,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { error: "統計情報の取得に失敗しました" },
      { status: 500 }
    )
  }
}
