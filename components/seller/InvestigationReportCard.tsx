"use client"

import { useState } from "react"

const STEPS = [
  {
    id: 1,
    title: "管理会社・管理組合の確認",
    description: "物件の管理会社または管理組合の連絡先を確認します。",
    tips: [
      "管理費の請求書や総会の案内に記載されています",
      "マンションのエントランスに掲示されていることも",
    ],
    documents: ["管理規約", "総会資料"],
  },
  {
    id: 2,
    title: "重要事項調査報告書の依頼",
    description: "管理会社に調査報告書の発行を依頼します。",
    tips: [
      "発行まで1〜2週間かかることが多い",
      "費用は5,000円〜20,000円程度",
      "売買契約前に取得が必要",
    ],
    documents: ["依頼書（管理会社指定のフォーマット）"],
  },
  {
    id: 3,
    title: "報告書の内容確認",
    description: "取得した報告書の内容を確認します。",
    tips: [
      "管理費・修繕積立金の滞納状況",
      "大規模修繕の履歴と予定",
      "管理組合の財務状況",
      "使用細則（ペット、駐車場など）",
    ],
    documents: ["重要事項調査報告書"],
  },
  {
    id: 4,
    title: "買主への説明準備",
    description: "報告書の内容を整理し、説明できるようにします。",
    tips: [
      "特記事項や注意点をまとめる",
      "不明点は管理会社に確認",
    ],
    documents: [],
  },
]

export default function InvestigationReportCard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const toggleComplete = (stepId: number) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter((id) => id !== stepId))
    } else {
      setCompletedSteps([...completedSteps, stepId])
    }
  }

  const step = STEPS.find((s) => s.id === currentStep)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-base font-medium text-gray-900">重要事項調査報告書の取得サポート</h3>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        マンション売却に必要な重要事項調査報告書の取得手順をガイドします。
      </p>

      {/* ステップ進捗 */}
      <div className="flex items-center justify-between mb-6">
        {STEPS.map((s, index) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => setCurrentStep(s.id)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                completedSteps.includes(s.id)
                  ? "bg-green-500 text-white"
                  : currentStep === s.id
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {completedSteps.includes(s.id) ? "✓" : s.id}
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={`w-12 h-0.5 ${
                  completedSteps.includes(s.id) ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* 現在のステップ詳細 */}
      {step && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">
              Step {step.id}: {step.title}
            </h4>
            <button
              onClick={() => toggleComplete(step.id)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                completedSteps.includes(step.id)
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {completedSteps.includes(step.id) ? "完了済み" : "完了にする"}
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">{step.description}</p>

          {step.tips.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded p-3 mb-3">
              <p className="text-xs font-medium text-blue-800 mb-2">ポイント</p>
              <ul className="text-xs text-blue-700 space-y-1">
                {step.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-blue-500">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step.documents.length > 0 && (
            <div className="bg-gray-50 rounded p-3">
              <p className="text-xs font-medium text-gray-700 mb-2">必要書類</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {step.documents.map((doc, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ナビゲーション */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          前へ
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(STEPS.length, currentStep + 1))}
          disabled={currentStep === STEPS.length}
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          次へ
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        完了: {completedSteps.length}/{STEPS.length}ステップ
      </p>
    </div>
  )
}
