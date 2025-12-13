"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import PropertyForm from "@/components/property/PropertyForm"

export default function NewPropertyPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push("/auth/signin?callbackUrl=/properties/new")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <PropertyForm />
      </div>
    </div>
  )
}



