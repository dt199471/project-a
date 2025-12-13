import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const propertyId = searchParams.get("propertyId")
    const conversationWith = searchParams.get("conversationWith")

    if (conversationWith && propertyId) {
      // 特定のユーザーとの会話を取得
      const messages = await prisma.message.findMany({
        where: {
          propertyId,
          OR: [
            {
              senderId: session.user.id,
              receiverId: conversationWith,
            },
            {
              senderId: conversationWith,
              receiverId: session.user.id,
            },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      })

      return NextResponse.json(messages)
    }

    // ユーザーの全メッセージ一覧を取得（会話ごとにグループ化）
    const sentMessages = await prisma.message.findMany({
      where: { senderId: session.user.id },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: session.user.id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // 会話をグループ化
    const conversations = new Map()

    sentMessages.forEach((msg) => {
      const key = `${msg.propertyId}-${msg.receiverId}`
      if (!conversations.has(key)) {
        conversations.set(key, {
          property: msg.property,
          otherUser: msg.receiver,
          lastMessage: msg,
          unreadCount: 0,
        })
      }
    })

    receivedMessages.forEach((msg) => {
      const key = `${msg.propertyId}-${msg.senderId}`
      if (!conversations.has(key)) {
        conversations.set(key, {
          property: msg.property,
          otherUser: msg.sender,
          lastMessage: msg,
          unreadCount: 1,
        })
      } else {
        const conv = conversations.get(key)
        if (msg.createdAt > conv.lastMessage.createdAt) {
          conv.lastMessage = msg
          conv.unreadCount += 1
        }
      }
    })

    return NextResponse.json(Array.from(conversations.values()))
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "メッセージの取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { propertyId, receiverId, content } = body

    if (!propertyId || !receiverId || !content) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      )
    }

    const message = await prisma.message.create({
      data: {
        content,
        propertyId,
        senderId: session.user.id,
        receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json(
      { error: "メッセージの送信に失敗しました" },
      { status: 500 }
    )
  }
}



