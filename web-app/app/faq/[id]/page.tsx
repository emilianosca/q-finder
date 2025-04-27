import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFaqById, getNextFaq, getPrevFaq } from "@/lib/data";

// metadada for eachpage
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const faq = getFaqById(params.id);

  if (!faq) {
    return {
      title: "FAQ Not Found",
      description: "The requested FAQ could not be found.",
    };
  }

  return {
    title: `${faq.question} | Untitled UI FAQ`,
    description: faq.answer.substring(0, 155) + "...",
    openGraph: {
      title: faq.question,
      description: faq.answer.substring(0, 155) + "...",
      type: "article",
      url: `https://untitledui.com/faq/${faq.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: faq.question,
      description: faq.answer.substring(0, 155) + "...",
    },
  };
}

export default function FaqPage({ params }: { params: { id: string } }) {
  const faq = getFaqById(params.id);

  if (!faq) {
    notFound();
  }

  const prevFaq = getPrevFaq(faq.id);
  const nextFaq = getNextFaq(faq.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="flex items-center gap-1 hover:text-gray-900">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <Link href="/" className="hover:text-gray-900">
          FAQ
        </Link>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-[200px] md:max-w-md">
          {faq.question}
        </span>
      </div>

      <article className="mb-12">
        <header className="bg-[url('/grid-pattern.svg')] bg-[length:20px_20px] bg-repeat py-8 px-4 md:px-8 rounded-lg mb-8">
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

      <div className="mt-12 flex flex-col sm:flex-row justify-between gap-4">
        {prevFaq ? (
          <Link href={`/faq/${prevFaq.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 justify-start"
            >
              <ArrowLeft className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Previous: {prevFaq.question}</span>
            </Button>
          </Link>
        ) : (
          <div className="flex-1"></div>
        )}

        {nextFaq ? (
          <Link href={`/faq/${nextFaq.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 justify-end"
            >
              <span className="truncate">Next: {nextFaq.question}</span>
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Button>
          </Link>
        ) : (
          <div className="flex-1"></div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href="/">
          <Button>Back to all FAQs</Button>
        </Link>
      </div>
    </div>
  );
}
