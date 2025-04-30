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
       // notFound 
    return {
      title: "No se encontró la FAQ",
      description: "La FAQ solicitada no se pudo encontrar.",
      openGraph: {
        title: "FAQ No Encontrada",
        description: "La FAQ solicitada no se pudo encontrar.",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: "FAQ No Encontrada",
        description: "La FAQ solicitada no se pudo encontrar.",
      },
    };
  }

  if (!faq) {
    return {
      title: "No se encontró la FAQ",
      description: "La FAQ solicitada no se pudo encontrar.",
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

export default async function FaqPage({ params }: { params: { id: string } }) {
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
    <div className="container mx-auto px-4 py-8 max-w-5xl flex flex-col min-h-[calc(100vh-20vh)]">
      {/* Breadcrumbs */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
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
        <article className="mb-8">
        <header className="bg-[url('/grid-pattern.svg')] bg-repeat bg-[length:20px_20px] py-8 px-4 md:px-8 rounded-t-lg">
          <h1 className="text-3xl md:text-4xl font-serif font-medium tracking-tight">
            {faq.question}
          </h1>
        </header>

        {/* Fixed-height card */}
        <Card className="border-gray-200 rounded-b-lg overflow-hidden h-64">
          <CardContent className="p-4 overflow-y-auto">
            <div className="prose prose-gray max-w-none whitespace-pre-wrap">
              <h2 className="text-gray-700 text-lg leading-relaxed">
                {faq.answer}
              </h2>
            </div>
          </CardContent>
        </Card>
      </article>

      {/* Prev / Next Navigation */}
      <div className="mt-auto">
        <div className="grid grid-cols-2 gap-4">
          {prevFaq ? (
            <Link href={`/faq/${prevFaq.id}`}>
              <Button
                variant="outline"
                className="w-full h-12 flex items-center justify-start space-x-2 px-3"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="line-clamp-1">
                  Anterior: {prevFaq.question}
                </span>
              </Button>
            </Link>
          ) : (
            <div />
          )}

          {nextFaq ? (
            <Link href={`/faq/${nextFaq.id}`}>
              <Button
                variant="outline"
                className="w-full h-12 flex items-center justify-end space-x-2 px-3"
              >
                <span className="line-clamp-1">
                  Siguiente: {nextFaq.question}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>

        <div className="mt-4 flex justify-center">
          <Link href="/">
            <Button size="sm">Regresar a inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
