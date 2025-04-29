"use client"

import React, { useEffect, useState } from "react"
import { useQueryState } from "nuqs"
import useSWR from "swr"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { API_BASE_URL } from "@/lib/api"
import Link from "next/link"

// Tu tipo FAQ
export type Faq = {
  id: number
  question: string
  answer: string
  createdAt: string
  updatedAt: string
  slug?: string
}

// Fetcher para SWR
const fetchFaq = async (query: string): Promise<Faq | null> => {
  if (!query) return null
  const res = await fetch(
    `${API_BASE_URL}/api/search?query=${encodeURIComponent(query)}`
  )
  if (!res.ok) return null
  return res.json()
}

export default function FaqSearch() {
  const [searchQuery, setSearchQuery] = useQueryState("query", {
    defaultValue: "",
  })
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery || "")

  // Debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery || "")
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  // SWR hook
  const { data: faq, isLoading, error } = useSWR(
    debouncedQuery ? `/api/search?query=${debouncedQuery}` : null,
    () => fetchFaq(debouncedQuery),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  )

  console.log("FAQ", faq)

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
          value={searchQuery || ""}
          onChange={handleSearchChange}
        />
      </div>

      <div className="mt-6">
        {/* Skeleton Loader */}
        {isLoading && debouncedQuery && (
          <div className="space-y-2 mt-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-500 mt-4">
            Ups, hubo un error. Intenta de nuevo más tarde.
          </p>
        )}

        {/* Resultado */}
        {!isLoading && faq && (
          <div className="bg-white p-4 rounded shadow mt-4">
            <Link href ={`/faq/${faq.id}`}>
            <h2 className="text-lg font-semibold">{faq.question}</h2>
            <p className="text-gray-700 mt-2">{faq.answer}</p>
            </Link>
          </div>
        )}

        {/* No encontrado */}
        {!isLoading && debouncedQuery && !faq && (
          <p className="text-gray-400 mt-4">
            No se encontró nada para &quot;{debouncedQuery}&quot;.
          </p>
        )}
      </div>
    </div>
  )
}