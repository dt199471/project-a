import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { mansionName, address } = await request.json()

    if (!mansionName && !address) {
      return NextResponse.json(
        { error: "マンション名または住所を入力してください" },
        { status: 400 }
      )
    }

    const searchQuery = mansionName
      ? `${mansionName} マンション 築年 構造 総戸数 階建て`
      : `${address} マンション 物件情報`

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      tools: [{ type: "web_search_preview" }],
      input: [
        {
          role: "user",
          content: `以下のマンション情報をWeb検索で調べて、JSON形式で返してください。

検索対象: ${mansionName || address}

必ず以下のJSON形式で返してください（値が不明な場合はnull）:
{
  "mansionName": "正式なマンション名",
  "prefecture": "都道府県",
  "city": "市区町村",
  "address": "番地以降の住所",
  "nearestStation": "最寄り駅と徒歩分数（例: JR山手線 渋谷駅 徒歩5分）",
  "buildYear": 築年（数値のみ、例: 2015）,
  "buildMonth": 築月（数値のみ、例: 3）,
  "structure": "建物構造（木造/鉄骨造/鉄筋コンクリート造（RC）/鉄骨鉄筋コンクリート造（SRC）/軽量鉄骨造/その他）",
  "totalFloors": 総階数（数値のみ）,
  "totalUnits": 総戸数（数値のみ）,
  "managementCompany": "管理会社名",
  "developer": "分譲会社・デベロッパー名"
}

JSONのみを返してください。説明文は不要です。`,
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
    const jsonMatch = resultText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "情報を取得できませんでした", raw: resultText },
        { status: 500 }
      )
    }

    const propertyInfo = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      success: true,
      data: propertyInfo,
    })
  } catch (error) {
    console.error("Property assist error:", error)
    return NextResponse.json(
      { error: "情報取得中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
