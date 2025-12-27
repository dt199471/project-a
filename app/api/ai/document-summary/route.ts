import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { documentText, documentType } = await request.json()

    if (!documentText) {
      return NextResponse.json(
        { error: "書類の内容を入力してください" },
        { status: 400 }
      )
    }

    const docTypeLabel = documentType === "contract" ? "売買契約書" : "重要事項説明書"

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `あなたは不動産取引の専門家です。${docTypeLabel}の内容を売主にわかりやすく要約してください。
特に以下の点を重点的に説明してください：
- 売主が特に注意すべき条項
- 金銭に関する重要事項（手付金、違約金、精算金など）
- 契約解除に関する条件
- 瑕疵担保責任（契約不適合責任）
- 特約事項`,
        },
        {
          role: "user",
          content: `以下の${docTypeLabel}の内容を要約してください。箇条書きで、重要なポイントをわかりやすく説明してください。

【書類内容】
${documentText}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    })

    const summary = response.choices[0].message.content || ""

    return NextResponse.json({
      success: true,
      summary,
    })
  } catch (error) {
    console.error("Document summary error:", error)
    return NextResponse.json(
      { error: "書類の要約中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
