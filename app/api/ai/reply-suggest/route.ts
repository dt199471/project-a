import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { messages, propertyTitle, isSeller } = await request.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "メッセージ履歴がありません" },
        { status: 400 }
      )
    }

    // 直近のメッセージを取得（最大10件）
    const recentMessages = messages.slice(-10)
    const messageHistory = recentMessages
      .map((m: { sender: { name: string }; content: string }) =>
        `${m.sender.name}: ${m.content}`
      )
      .join("\n")

    const role = isSeller ? "売主" : "購入検討者"
    const counterpart = isSeller ? "購入検討者" : "売主"

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `あなたは不動産取引のメッセージ返信をサポートするアシスタントです。
${role}として${counterpart}に返信する文案を作成してください。

ポイント：
- 丁寧で誠実な文体
- 質問には具体的に回答
- 次のステップを提案（内覧日程調整、価格交渉など）
- 簡潔で読みやすい文章

物件: ${propertyTitle}`,
        },
        {
          role: "user",
          content: `以下のメッセージ履歴を踏まえて、適切な返信文案を3つ提案してください。

【メッセージ履歴】
${messageHistory}

返信案を3つ、それぞれ異なるトーンで提案してください（1. 丁寧、2. フレンドリー、3. ビジネスライク）。
各返信案は改行で区切ってください。`,
        },
      ],
      temperature: 0.7,
    })

    const suggestions = response.choices[0].message.content || ""

    return NextResponse.json({
      success: true,
      suggestions,
    })
  } catch (error) {
    console.error("Reply suggest error:", error)
    return NextResponse.json(
      { error: "返信案の生成中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
