"use client"

import { useState } from "react"

export default function DocumentSummaryCard() {
  const [documentType, setDocumentType] = useState<"important" | "contract">("important")
  const [documentText, setDocumentText] = useState("")
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState("")

  const handleSummarize = async () => {
    if (!documentText.trim()) {
      alert("書類の内容を入力してください")
      return
    }

    setLoading(true)
    setSummary("")

    try {
      const response = await fetch("/api/ai/document-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText,
          documentType,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSummary(result.summary)
      } else {
        alert(result.error || "要約に失敗しました")
      }
    } catch (error) {
      console.error("Document summary error:", error)
      alert("要約中にエラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-base font-medium text-gray-900">書類要約アシスト</h3>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        重要事項説明書や契約書の内容をAIがわかりやすく要約します。
        書類のテキストを貼り付けてください。
      </p>

      {/* 書類タイプ選択 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setDocumentType("important")}
          className={`px-3 py-1.5 text-xs rounded border transition-colors ${
            documentType === "important"
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
          }`}
        >
          重要事項説明書
        </button>
        <button
          onClick={() => setDocumentType("contract")}
          className={`px-3 py-1.5 text-xs rounded border transition-colors ${
            documentType === "contract"
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
          }`}
        >
          売買契約書
        </button>
      </div>

      {/* テキスト入力 */}
      <textarea
        value={documentText}
        onChange={(e) => setDocumentText(e.target.value)}
        placeholder="書類の内容をここに貼り付けてください..."
        rows={6}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500 resize-none mb-3"
      />

      <button
        onClick={handleSummarize}
        disabled={loading || !documentText.trim()}
        className="w-full py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            要約中...
          </>
        ) : (
          "AIで要約する"
        )}
      </button>

      {/* 要約結果 */}
      {summary && (
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded p-4">
          <p className="text-xs font-medium text-gray-700 mb-2">要約結果</p>
          <div className="text-sm text-gray-600 whitespace-pre-wrap">{summary}</div>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">
        ※ AIによる要約は参考情報です。重要な判断は専門家にご相談ください。
      </p>
    </div>
  )
}
