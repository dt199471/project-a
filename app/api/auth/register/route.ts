import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { loginId, name } = body

    if (!loginId) {
      return NextResponse.json(
        { error: "ログインIDは必須です" },
        { status: 400 }
      )
    }

    // 既存ユーザーチェック
    const existingUser = await prisma.user.findUnique({
      where: { loginId },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "このIDは既に使用されています" },
        { status: 400 }
      )
    }

    // 新規ユーザー作成
    const user = await prisma.user.create({
      data: {
        loginId,
        name: name || loginId,
      },
    })

    return NextResponse.json({
      id: user.id,
      loginId: user.loginId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
      image: user.image,
    }, { status: 201 })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json(
      { error: "登録に失敗しました" },
      { status: 500 }
    )
  }
}

