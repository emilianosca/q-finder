import type { MetadataRoute } from "next";
import type { Faq } from "@/types/schema";
import { FRONTEND_NEXT_BASE_URL, BACKEND_API_BASE_URL } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = FRONTEND_NEXT_BASE_URL; // web url

  let faqData: Faq[] = [];
  try {
    const res = await fetch(`${BACKEND_API_BASE_URL}/api/faqs/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    faqData = await res.json();
  } catch (err) {
    console.warn("Could not fetch FAQs for sitemap:", err);
  }

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
