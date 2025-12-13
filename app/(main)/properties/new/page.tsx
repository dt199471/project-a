"use client"

import PropertyForm from "@/components/property/PropertyForm"

export default function NewPropertyPage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <PropertyForm />
      </div>
    </div>
  )
}



