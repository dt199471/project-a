import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ExtractedData {
  mansionName?: string
  prefecture?: string
  city?: string
  address?: string
  nearestStation?: string
  buildYear?: number
  buildMonth?: number
  layout?: string
  area?: number
  structure?: string
  floor?: number
  totalFloors?: number
  direction?: string
  managementFee?: number
  repairReserve?: number
  price?: number
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "OpenAI APIキーが設定されていません" },
        { status: 500 }
      )
    }

    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { success: false, error: "画像が提供されていません" },
        { status: 400 }
      )
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `あなたはマンションのパンフレットや間取り図から物件情報を抽出するエキスパートです。
画像から読み取れる情報を正確に抽出してください。
読み取れない情報はnullとしてください。
価格は円単位で返してください（例: 3500万円 → 35000000）。
面積は㎡単位の数値で返してください。
管理費・修繕積立金は円/月単位で返してください。

以下のJSON形式で返してください：
{
  "mansionName": "マンション名",
  "prefecture": "都道府県",
  "city": "市区町村",
  "address": "番地以降の住所",
  "nearestStation": "最寄り駅（例: JR山手線 渋谷駅 徒歩5分）",
  "buildYear": 数値（築年）,
  "buildMonth": 数値（築月、1-12）,
  "layout": "間取り（例: 3LDK）",
  "area": 数値（専有面積、㎡）,
  "structure": "構造（例: 鉄筋コンクリート造（RC））",
  "floor": 数値（所在階）,
  "totalFloors": 数値（建物総階数）,
  "direction": "向き（南、北東など）",
  "managementFee": 数値（管理費、円/月）,
  "repairReserve": 数値（修繕積立金、円/月）,
  "price": 数値（販売価格、円単位）
}`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "このパンフレットまたは間取り図から物件情報を抽出してください。読み取れる情報をすべてJSON形式で返してください。",
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      response_format: { type: "json_object" },
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { success: false, error: "AIからの応答がありませんでした" },
        { status: 500 }
      )
    }

    let extractedData: ExtractedData
    try {
      extractedData = JSON.parse(content)
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      return NextResponse.json(
        { success: false, error: "AIからの応答の解析に失敗しました" },
        { status: 500 }
      )
    }

    // nullや空文字列を除去
    const cleanedData: ExtractedData = {}
    for (const [key, value] of Object.entries(extractedData)) {
      if (value !== null && value !== undefined && value !== "") {
        (cleanedData as any)[key] = value
      }
    }

    // 何も抽出できなかった場合
    if (Object.keys(cleanedData).length === 0) {
      return NextResponse.json({
        success: false,
        error: "画像から物件情報を読み取れませんでした。パンフレットや間取り図が鮮明に写っていることを確認してください。",
      })
    }

    return NextResponse.json({
      success: true,
      data: cleanedData,
    })
  } catch (error: any) {
    console.error("Pamphlet extract error:", error)

    if (error?.status === 401) {
      return NextResponse.json(
        { success: false, error: "OpenAI APIキーが無効です" },
        { status: 401 }
      )
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { success: false, error: "APIの利用制限に達しました" },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { success: false, error: "パンフレット解析に失敗しました" },
      { status: 500 }
    )
  }
}
