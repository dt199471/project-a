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

    // ユーザーIDが指定されている場合、そのユーザーの会話一覧を取得
    if (userId) {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId },
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
          createdAt: "desc",
        },
      })

      // 会話をグループ化（property + otherUser の組み合わせ）
      const conversationsMap = new Map<string, {
        property: { id: string; title: string };
        otherUser: { id: string; name: string | null; image: string | null };
        lastMessage: { id: string; content: string; createdAt: Date; senderId: string };
        unreadCount: number;
      }>();

      for (const msg of messages) {
        const otherUser = msg.senderId === userId ? msg.receiver : msg.sender
        if (!otherUser) continue
        
        const key = `${msg.property.id}-${otherUser.id}`
        
        if (!conversationsMap.has(key)) {
          conversationsMap.set(key, {
            property: msg.property,
            otherUser: otherUser,
            lastMessage: {
              id: msg.id,
              content: msg.content,
              createdAt: msg.createdAt,
              senderId: msg.senderId,
            },
            unreadCount: 0, // TODO: 未読カウントの実装
          })
        }
      }

      return NextResponse.json(Array.from(conversationsMap.values()))
    }

    // 全メッセージ一覧を取得（従来の挙動）
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




