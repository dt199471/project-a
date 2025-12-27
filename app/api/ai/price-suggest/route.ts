import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { currentPrice, title, daysSinceListing, favoriteCount, messageCount } =
      await request.json()

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `あなたは不動産売却のアドバイザーです。物件の状況を分析して、価格戦略をアドバイスしてください。
簡潔に2-3文でアドバイスを返してください。`,
        },
        {
          role: "user",
          content: `以下の物件の価格戦略をアドバイスしてください。

物件名: ${title}
現在価格: ${Number(currentPrice).toLocaleString()}万円
掲載日数: ${daysSinceListing}日
お気に入り数: ${favoriteCount}件
問い合わせ数: ${messageCount}件

掲載日数、お気に入り数、問い合わせ数を踏まえて、価格を調整すべきか、現状維持すべきかをアドバイスしてください。`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    const suggestion = response.choices[0].message.content || ""

    return NextResponse.json({
      success: true,
      suggestion,
    })
  } catch (error) {
    console.error("Price suggest error:", error)
    return NextResponse.json(
      { error: "価格分析中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
