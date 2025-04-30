import type { MetadataRoute } from "next";
import type { Faq } from "@/types/schema";
import { NEXT_BASE_URL, API_BASE_URL } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = NEXT_BASE_URL; // web url

  // get all FAQs
  const faqData: Faq[] = await fetch(`${API_BASE_URL}/api/faqs/`, {
    next: { revalidate: 3600 },
  }).then((res) => res.json());

  if (!faqData || !Array.isArray(faqData)) {
    console.error("Invalid FAQ data format");
    return [];
  }

  console.log(`Fetched ${faqData.length} FAQs for sitemap.`);

  const faqUrls = faqData.map((faq) => ({
    url: `${baseUrl}/faq/${faq.id}`,
    slug: faq.slug,
    lastModified: new Date(faq.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...faqUrls,
  ];
}
