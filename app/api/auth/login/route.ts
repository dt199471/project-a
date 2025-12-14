import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { loginId } = body

    if (!loginId) {
      return NextResponse.json(
        { error: "ログインIDは必須です" },
        { status: 400 }
      )
    }

    // ユーザー検索
    const user = await prisma.user.findUnique({
      where: { loginId },
    })

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: user.id,
      loginId: user.loginId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
      image: user.image,
    })
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json(
      { error: "ログインに失敗しました" },
      { status: 500 }
    )
  }
}

