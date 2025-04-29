import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Faq } from "@/types/schema";

// Fetch a single FAQ by ID
async function getFaqById(id: string): Promise<Faq> {
  const apiUrl = process.env.API_URL || "http://backend:8000";
  const res = await fetch(`${apiUrl}/api/faqs/${id}`, { cache: "no-store" });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Error fetching FAQ: ${errorData.detail || res.statusText}`
    );
  }
  return res.json();
}

// Helpers to fetch prev/next (reusing getFaqById)
// prev
async function getPrevFaq(currentId: number): Promise<Faq | null> {
  try {
    return await getFaqById((currentId - 1).toString());
  } catch {
    return null;
  }
}
// next
async function getNextFaq(currentId: number): Promise<Faq | null> {
  try {
    return await getFaqById((currentId + 1).toString());
  } catch {
    return null;
  }
}

// Metadata generation
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  let faq: Faq | null = null;
  try {
    faq = await getFaqById(params.id);
  } catch {
    // notFound metadata
  }

  if (!faq) {
    return {
      title: "FAQ Not Found",
      description: "The requested FAQ could not be found.",
    };
  }

  return {
    title: `${faq.question} | Q FINDER FAQ`,
    description: faq.answer.substring(0, 155) + "...",
    openGraph: {
      title: faq.question,
      description: faq.answer.substring(0, 155) + "...",
      type: "article",
      url: `https://qfinder.com/faq/${faq.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: faq.question,
      description: faq.answer.substring(0, 155) + "...",
    },
  };
}

// The actual page component
export default async function FaqPage({ params }: { params: { id: string } }) {
  // Main FAQ
  let faq: Faq;
  try {
    faq = await getFaqById(params.id);
  } catch {
    notFound();
  }

  // Prev/Next
  const prevFaq = await getPrevFaq(Number(params.id));
  const nextFaq = await getNextFaq(Number(params.id));

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumbs */}
      <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="flex items-center gap-1 hover:text-gray-900">
          <Home className="h-4 w-4" />
          <span>Inicio</span>
        </Link>
        <span>/ FAQ /</span>
        <span className="text-gray-900 truncate max-w-[200px] md:max-w-md">
          {faq.question}
        </span>
      </div>

      {/* Question & Answer */}
      <article className="mb-12">
        <header className="bg-[url('/grid-pattern.svg')] bg-repeat bg-[length:20px_20px] py-8 px-4 md:px-8 rounded-lg mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-medium tracking-tight">
            {faq.question}
          </h1>
        </header>
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </CardContent>
        </Card>
      </article>

      {/* Prev / Next Navigation */}
      <div className="mt-12 flex flex-col sm:flex-row justify-between gap-4 w-full">
        {prevFaq ? (
          <Link href={`/faq/${prevFaq.id}`} className="flex-1">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Anterior: {prevFaq.question}</span>
            </Button>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        <div className="flex-1 flex justify-end">
          {nextFaq ? (
            <Link href={`/faq/${nextFaq.id}`} className="flex-1">
              <Button
                variant="outline"
                className="flex items-center gap-2 justify-end"
              >
                <span>Siguiente: {nextFaq.question}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-8 text-center">
        <Link href="/">
          <Button>Regresar a inicio</Button>
        </Link>
      </div>
    </div>
  );
}
