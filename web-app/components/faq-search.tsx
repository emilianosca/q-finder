"use client";

import React, { useEffect, useState, useRef } from "react";
import { useQueryState } from "nuqs";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, Loader2, X } from "lucide-react";
import Link from "next/link";
import type { Faq } from "@/types/schema";

// SWR Fetcher
const fetchFaqs = async (apiUrl: string): Promise<Faq[]> => {
  const res = await fetch(apiUrl);
  if (!res.ok) {
    console.error(`API Error: Status ${res.status}`);
    throw new Error(`Failed to fetch FAQs: Status ${res.status}`);
  }
  if (res.status === 204) return [];
  try {
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Failed to parse API response:", e);
    throw new Error("Invalid API response format");
  }
};

const FaqItemSkeleton = () => (
  <div className="block bg-white p-4 rounded-md border border-gray-200 shadow-sm animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
  </div>
);

export default function FaqSearch() {
  const [searchQuery, setSearchQuery] = useQueryState("query", {
    defaultValue: "",
    history: "replace",
    shallow: false,
  });
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const prevIsValidating = useRef(false);

  const apiUrlBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery || "");
    }, 300); // debouncce time
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  //  swr Hook
  const swrKey =
    debouncedQuery && apiUrlBase
      ? `${apiUrlBase}/api/search?query=${encodeURIComponent(debouncedQuery)}`
      : null;

  const {
    data: faqs,
    error,
    isValidating, // Tracks if a request is in flight
  } = useSWR<Faq[]>(swrKey, fetchFaqs, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (prevIsValidating.current && !isValidating) {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        if (debouncedQuery) {
          console.log("Restoring focus to search input");
          inputRef.current.focus();
        }
      }
    }
    prevIsValidating.current = isValidating;
  }, [isValidating, debouncedQuery]); // re-run when loading state or query changes

  if (!apiUrlBase) {
    console.error("FATAL: NEXT_PUBLIC_API_URL is not defined.");
    return "No hay url definida para la API";
  }

  const hasSearchQuery = !!searchQuery;
  const hasDebouncedQuery = !!debouncedQuery;
  const showLoading = isValidating && hasDebouncedQuery;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const showNoResults =
    !showLoading && !error && hasDebouncedQuery && faqs?.length === 0;

  return (
    <div className="max-w-md mx-auto mb-8">
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10">
          <Search />
        </span>
        <Input
          ref={inputRef}
          type="search"
          placeholder="Busca en las preguntas frecuentes..."
          className={`pl-10 ${
            hasSearchQuery && !showLoading ? "pr-10" : "pr-4"
          } ${
            showLoading ? "pr-10" : "pr-4"
          } py-5 rounded-md border-gray-200 bg-white/80 shadow-sm w-full transition-all duration-150 ${
            showLoading ? "opacity-70" : ""
          }`} // Removed explicit disable style, rely on prop
          value={searchQuery || ""}
          onChange={handleSearchChange}
          aria-label="Buscar preguntas frecuentes"
          disabled={showLoading}
          aria-busy={showLoading}
        />
        {!showLoading && hasSearchQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 z-10 p-1 rounded-full hover:bg-gray-100"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {showLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>

      <div className="mt-6 min-h-[150px] overflow-hidden" aria-live="polite">
        {showLoading && (
          <div className="space-y-3 mt-4">
            <FaqItemSkeleton />
            <FaqItemSkeleton />
            <FaqItemSkeleton />
          </div>
        )}

        {error && !showLoading && (
          <div className="text-red-600 mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-center">
            <p className="font-medium">Ups, hubo un error al buscar.</p>
            {process.env.NODE_ENV === "development" && error.message && (
              <p className="text-sm mt-1">Detalle: {error.message}</p>
            )}
            <p className="text-sm mt-1">Intenta de nuevo más tarde.</p>
          </div>
        )}

        {!showLoading &&
          !error &&
          hasDebouncedQuery &&
          faqs &&
          faqs.length > 0 && (
            <div className="space-y-4 mt-4">
              {faqs.map((faq) => (
                <Link
                  key={faq.id}
                  href={`/faq/${faq.id}`}
                  className="block bg-white p-4 rounded-md border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors duration-150 group"
                >
                  <h2 className="text-base font-semibold text-gray-800 group-hover:text-blue-600">
                    {faq.question}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {faq.answer}
                  </p>
                </Link>
              ))}
            </div>
          )}

        {showNoResults && (
          <div
            className="text-center mt-6 p-6 bg-gray-5
          0 border border-dashed border-gray-300 rounded-md"
          >
            <p className="text-gray-500 mb-4">
            No se encontró nada para &quot;{debouncedQuery}&quot;.
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className={showLoading ? "opacity-70 pointer-events-none" : ""}
            >
              <Link href="/create" aria-disabled={showLoading}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Intenta creando tu pregunta
              </Link>
            </Button>
          </div>
        )}

        {!showLoading && !error && !hasDebouncedQuery && (
          <div className="text-center mt-6 p-6 text-gray-400">
            Escribe algo para buscar en las preguntas frecuentes.
          </div>
        )}
      </div>
    </div>
  );
}
