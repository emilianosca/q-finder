'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useQueryState } from 'nuqs';
import useSWR from 'swr';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, PlusCircle, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import type { Faq } from '@/types/schema';
import { API_BASE_URL } from '@/lib/api';

// SWR Fetcher
const fetchFaqs = async (url: string): Promise<Faq[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`API Error: Status ${res.status}`);
    throw new Error(`Failed to fetch FAQs: Status ${res.status}`);
  }
  if (res.status === 204) return [];
  const data = await res.json().catch((e) => {
    console.error('Failed to parse API response:', e);
    throw new Error('Invalid API response format');
  });
  return Array.isArray(data) ? data : [];
};

const FaqItemSkeleton = () => (
  <div className="block bg-white p-4 rounded-md border border-gray-200 shadow-sm animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
  </div>
);

export default function FaqSearch() {
  const [searchQuery, setSearchQuery] = useQueryState('query', {
    defaultValue: '',
    history: 'replace',
    shallow: false,
  });
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const prevIsValidating = useRef(false);

  // Construct the API URL from env-configured backend base URL
  const apiUrlBase = API_BASE_URL;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery || '');
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const swrKey =
    debouncedQuery && apiUrlBase
      ? `${apiUrlBase}/api/search?query=${encodeURIComponent(debouncedQuery)}`
      : null;

  const {
    data: faqs,
    error,
    isValidating,
  } = useSWR<Faq[]>(
    swrKey,
    fetchFaqs,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 5,
      errorRetryInterval: 3000,
      revalidateOnMount: Boolean(swrKey),
      // Retry logic if the backend isn't up yet
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // don't retry if no active query
        if (!debouncedQuery) return;
        // limit retries
        if (retryCount >= 5) return;
        // retry after interval
        setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
      },
      keepPreviousData: true,
    }
  );

  // Autofocus logic after loading
  useEffect(() => {
    if (prevIsValidating.current && !isValidating) {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        if (debouncedQuery) inputRef.current.focus();
      }
    }
    prevIsValidating.current = isValidating;
  }, [isValidating, debouncedQuery]);

  const hasSearchQuery = Boolean(searchQuery);
  const hasDebouncedQuery = Boolean(debouncedQuery);
  const showLoading = isValidating && hasDebouncedQuery;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const showNoResults =
    !showLoading && !error && hasDebouncedQuery && faqs?.length === 0;

  if (!apiUrlBase) {
    console.error('FATAL: API_BASE_URL is not defined.');
    return <p>No hay URL definida para la API</p>;
  }

  return (
    <div className="max-w-md mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Busca en las preguntas frecuentes..."
          className={`pl-10 pr-4 py-5 rounded-md border-gray-200 bg-white/80 shadow-sm w-full transition-all duration-150 ${
            showLoading ? 'opacity-70 pr-10' : 'pr-4'
          }`}
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="Buscar preguntas frecuentes"
          disabled={showLoading}
          aria-busy={showLoading}
        />
        {showLoading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400 z-10" />
        ) : hasSearchQuery ? (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10 p-1 rounded-full hover:bg-gray-100"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-6 min-h-[150px]" aria-live="polite">
        {showLoading && (
          <div className="space-y-3">
            <FaqItemSkeleton />
            <FaqItemSkeleton />
            <FaqItemSkeleton />
          </div>
        )}

        {error && !showLoading && (
          <div className="text-red-600 mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-center">
            <p className="font-medium">Ups, hubo un error al buscar.</p>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-sm mt-1">Detalle: {error.message}</p>
            )}
            <p className="text-sm mt-1">Intenta de nuevo más tarde.</p>
          </div>
        )}

        {!showLoading && !error && hasDebouncedQuery && faqs && faqs.length > 0 && (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Link
                key={faq.id}
                href={`/faq/${faq.id}`}
                className="block bg-white p-4 rounded-md border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors duration-150 group"
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
          <div className="text-center mt-6 p-6 border-dashed border-gray-300 rounded-md">
            <p className="text-gray-500 mb-4">
              No se encontró nada para &quot;{debouncedQuery}&quot;.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/create">
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
// This component is used to search FAQs and display the results.
