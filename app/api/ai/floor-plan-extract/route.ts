import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: "画像を選択してください" },
        { status: 400 }
      )
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `この画像がパンフレットや間取り図の場合、以下の情報をJSON形式で抽出してください：

{
  "layout": "間取り（例: 3LDK）",
  "area": "専有面積（数値のみ、㎡）",
  "rooms": [
    {
      "name": "部屋名（リビング、洋室1など）",
      "size": "畳数や㎡"
    }
  ],
  "features": ["特徴1", "特徴2"],
  "description": "間取りの特徴を50文字程度で説明"
}

間取り図ではない場合は {"error": "間取り図が見つかりません"} を返してください。
JSONのみを返してください。`,
            },
            {
              type: "image_url",
              image_url: { url: image },
            },
          ],
        },
      ],
      max_tokens: 500,
    })

    const resultText = response.choices[0].message.content || ""

    // JSONを抽出
    const jsonMatch = resultText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({
        success: false,
        error: "間取り情報を抽出できませんでした",
      })
    }

    const floorPlanData = JSON.parse(jsonMatch[0])

    if (floorPlanData.error) {
      return NextResponse.json({
        success: false,
        error: floorPlanData.error,
      })
    }

    return NextResponse.json({
      success: true,
      data: floorPlanData,
    })
  } catch (error) {
    console.error("Floor plan extract error:", error)
    return NextResponse.json(
      { error: "間取り抽出中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
