import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Faq } from "@/types/schema";
import { FRONTEND_NEXT_BASE_URL, BACKEND_API_BASE_URL } from "@/lib/api";

// Fetch a single FAQ by ID
async function getFaqById(id: string): Promise<Faq | null> {

  const res = await fetch(`${BACKEND_API_BASE_URL}/api/faqs/${id}`, {});

  if (res.status === 404) {
    return notFound(); // Handle 404 by returning null
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error(
      `Error fetching FAQ ${id}: ${errorData?.detail || res.statusText} (${
        res.status
      })`
    );
    throw new Error(`Failed to fetch FAQ ${id}`);
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
// Metadata Generation

// standard robots config
const faqRobotsConfig: Metadata["robots"] = {
  index: true,
  follow: true,
  nocache: false, // caching allowed
  googleBot: {
    index: true,
    follow: true,
    // noimageindex: false, // no images in this case
    // "max-video-preview": -1, // no videos im this case
    // "max-snippet": -1, // no snippets in this case
    // "max-image-preview": "large", // no images in this case
  },
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  let faq: Faq | null = null;
  try {
    faq = await getFaqById(params.id);
  } catch (error) {
    console.error(
      `Metadata generation failed for FAQ ${params.id} due to fetch error:`,
      error
    );
    return {
      title: "Error",
      description: "No se pudo cargar esta pregunta frecuente.",
      robots: faqRobotsConfig,
    };
  }

  if (!faq) {
    return {
      title: "FAQ No Encontrada",
      description: "La pregunta frecuente solicitada no existe.",
      robots: faqRobotsConfig,
    };
  }

  const pageUrl = `${FRONTEND_NEXT_BASE_URL}/faq/${faq.id}`;

  const description =
    faq.answer.substring(0, 160).replace(/\s+/g, " ").trim() +
    (faq.answer.length > 160 ? "..." : "");

  return {
    title: faq.question,
    description: description,
    robots: faqRobotsConfig,
    alternates: {
      canonical: pageUrl, // canonical URL
    },
    openGraph: {
      title: faq.question,
      description: description,
      url: pageUrl,
      type: "article",
      publishedTime: faq.created_at,
      modifiedTime: faq.updated_at,
    },
    twitter: {
      card: "summary",
      title: faq.question,
      description: description,
    },
  };
}

export default async function FaqPage({ params }: { params: { id: string } }) {
  let faq: Faq | null;
  try {
    faq = await getFaqById(params.id);
  } catch (error) {
    console.error("Error rendering FaqPage:", error);
    throw error;
  }

  if (!faq) {
    notFound();
  }

  const [prevFaq, nextFaq] = await Promise.all([
    getPrevFaq(Number(faq.id)),
    getNextFaq(Number(faq.id)),
  ]).catch((error) => {
    console.error("Error fetching prev/next FAQs:", error);
    return [null, null];
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl flex flex-col min-h-[calc(100vh-20vh)]">
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

      <article className="mb-8">
        <header className="bg-[url('/grid-pattern.svg')] bg-repeat bg-[length:20px_20px] py-8 px-4 md:px-8 rounded-t-lg">
          <h1 className="text-3xl md:text-4xl font-serif font-medium tracking-tight">
            {faq.question}
          </h1>
        </header>

        <Card className="border-gray-200 rounded-b-lg overflow-hidden h-64">
          <CardContent className="p-4 overflow-y-auto">
            <div className="prose prose-gray max-w-none whitespace-pre-wrap">
              {faq.answer}
            </div>
          </CardContent>
        </Card>
      </article>

      <div className="mt-auto">
        {" "}
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
