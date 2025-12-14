import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const propertyId = searchParams.get("propertyId")
    const conversationWith = searchParams.get("conversationWith")
    const userId = searchParams.get("userId")

    if (conversationWith && propertyId) {
      // 特定のユーザーとの会話を取得
      const messages = await prisma.message.findMany({
        where: {
          propertyId,
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

    // 全メッセージ一覧を取得
    const messages = await prisma.message.findMany({
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
        createdAt: "desc",
      },
    })

    return NextResponse.json(messages)
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
    const body = await request.json()
    const { propertyId, receiverId, content, senderId } = body


    if (!propertyId || !receiverId || !content) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      )
    }

    const finalSenderId = senderId || "default-user"
    
    // Check if users exist, create if not
    let senderExists = await prisma.user.findUnique({where:{id:finalSenderId}}).catch(()=>null);
    let receiverExists = await prisma.user.findUnique({where:{id:receiverId}}).catch(()=>null);

    // Create default sender if it doesn't exist
    if (!senderExists) {
      senderExists = await prisma.user.upsert({
        where: { id: finalSenderId },
        update: {},
        create: {
          id: finalSenderId,
          loginId: `user_${finalSenderId}`,
          name: "デフォルトユーザー",
          email: null,
        },
      })
    }

    // Ensure receiver exists
    if (!receiverExists) {
      receiverExists = await prisma.user.upsert({
        where: { id: receiverId },
        update: {},
        create: {
          id: receiverId,
          loginId: `user_${receiverId}`,
          name: "受信者",
          email: null,
        },
      })
    }

    const message = await prisma.message.create({
      data: {
        content,
        propertyId,
        senderId: finalSenderId,
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




