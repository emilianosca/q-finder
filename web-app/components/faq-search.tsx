"use client"

import React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function FaqSearch() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="max-w-md mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search"
          className="pl-10 py-5 rounded-md border-gray-200 bg-white/80"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  )
}
