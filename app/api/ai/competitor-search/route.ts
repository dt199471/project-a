import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prefecture, city, layout, price } = await request.json()

    if (!prefecture || !city) {
      return NextResponse.json(
        { error: "エリア情報が必要です" },
        { status: 400 }
      )
    }

    const searchQuery = `${prefecture}${city} マンション 売り出し ${layout || ""} ${price ? `${price}万円前後` : ""}`

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      tools: [{ type: "web_search_preview" }],
      input: [
        {
          role: "user",
          content: `${searchQuery} で現在売り出し中の競合物件を調べてください。

以下の情報をJSON配列で返してください（最大5件）:
[
  {
    "name": "物件名",
    "price": "価格（万円）",
    "layout": "間取り",
    "area": "専有面積",
    "buildYear": "築年数",
    "station": "最寄り駅",
    "source": "情報源サイト名"
  }
]

JSONのみを返してください。`,
        },
      ],
    })

    // レスポンスからテキストを抽出
    let resultText = ""
    if (response.output) {
      for (const item of response.output) {
        if (item.type === "message" && item.content) {
          for (const content of item.content) {
            if (content.type === "output_text") {
              resultText += content.text
            }
          }
        }
      }
    }

    // JSONを抽出
    const jsonMatch = resultText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return NextResponse.json({
        success: true,
        competitors: [],
        summary: "競合物件の情報を取得できませんでした。",
      })
    }

    const competitors = JSON.parse(jsonMatch[0])

    // 分析サマリーを生成
    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `以下の競合物件情報を分析して、売却戦略のアドバイスを2-3文で述べてください。
自分の物件: ${prefecture}${city}、${layout || ""}、${price ? `${price}万円` : "価格未定"}

競合物件:
${JSON.stringify(competitors, null, 2)}`,
        },
      ],
      max_tokens: 200,
    })

    return NextResponse.json({
      success: true,
      competitors,
      summary: summaryResponse.choices[0].message.content,
    })
  } catch (error) {
    console.error("Competitor search error:", error)
    return NextResponse.json(
      { error: "競合物件の検索中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
