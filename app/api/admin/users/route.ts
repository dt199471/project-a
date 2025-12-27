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

    const users = await prisma.user.findMany({
      select: {
        id: true,
        loginId: true,
        name: true,
        email: true,
        phone: true,
        isAdmin: true,
        createdAt: true,
        _count: {
          select: {
            properties: true,
            sentMessages: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "ユーザー一覧の取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const { searchParams } = new URL(request.url)
    const targetUserId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!adminUser?.isAdmin) {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 })
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "ユーザーIDが必要です" }, { status: 400 })
    }

    // 自分自身は削除できない
    if (targetUserId === userId) {
      return NextResponse.json({ error: "自分自身は削除できません" }, { status: 400 })
    }

    await prisma.user.delete({
      where: { id: targetUserId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "ユーザーの削除に失敗しました" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const body = await request.json()
    const { targetUserId, isAdmin } = body

    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!adminUser?.isAdmin) {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 })
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "ユーザーIDが必要です" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { isAdmin },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "ユーザーの更新に失敗しました" },
      { status: 500 }
    )
  }
}
