"use client";

import React, { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import type { Faq } from "@/types/schema";

// swr fetcher
const fetchFaqs = async (query: string): Promise<Faq[]> => {
  if (!query) return [];
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/search?query=${encodeURIComponent(
      query
    )}`
  );
  if (!res.ok) return [];
  return res.json();
};

export default function FaqSearch() {
  const [searchQuery, setSearchQuery] = useQueryState("query", {
    defaultValue: "",
  });
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery || "");

  // input debounced
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery || "");
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // key is null if no query, so SWR won't run until user types -- swr hook
  const {
    data: faqs,
    isLoading,
    error,
  } = useSWR<Faq[]>(
    debouncedQuery ? `/api/search?query=${debouncedQuery}` : null,
    () => fetchFaqs(debouncedQuery),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
        {/* Loading state */}
        {isLoading && debouncedQuery && (
          <div className="space-y-2 mt-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
          </div>
        )}

        {error && (
          <p className="text-red-500 mt-4">
            Ups, hubo un error. Intenta de nuevo más tarde.
          </p>
        )}

        {/* Results List */}
        {!isLoading && faqs && faqs.length > 0 && (
          <div className="space-y-4 mt-4">
            {faqs.map((faq) => (
              <Link
                key={faq.id}
                href={`/faq/${faq.id}`}
                className="block bg-white p-4 rounded shadow hover:bg-gray-50"
              >
                <h2 className="text-lg font-semibold">{faq.question}</h2>
                <p className="text-gray-700 mt-2 line-clamp-2">{faq.answer}</p>
              </Link>
            ))}
          </div>
        )}

        {/* No results */}
        {!isLoading && debouncedQuery && faqs && faqs.length === 0 && (
          <p className="text-gray-400 mt-4">
            No se encontró nada para &quot;{debouncedQuery}&quot;.
          </p>
        )}
      </div>
    </div>
  );
}
