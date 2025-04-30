import type { MetadataRoute } from "next";
import type { Faq } from "@/types/schema";
import { NEXT_BASE_URL, API_BASE_URL } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = NEXT_BASE_URL; // web url 

  // Generate FAQ URLs
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


// import type { MetadataRoute } from "next";
// import type { Faq } from "@/types/schema"; // Assuming Faq type is here

// // Define a type that represents the data ACTUALLY returned by the sitemap API endpoint.
// // It picks 'updatedAt' from Faq and ensures 'slug' is a required string.
// type FaqSitemapData = Pick<Faq, 'updated_at'> & {
//   slug: string; // Make slug required for sitemap data
// };

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
//   const backendApiUrl = process.env.BACKEND_API_SITEMAP_URL || "http://localhost:8000/api/faqs/sitemap-data";

//   let faqUrls: MetadataRoute.Sitemap = [];

//   try {
//     console.log(`Fetching sitemap data from: ${backendApiUrl}`);
//     const response = await fetch(backendApiUrl, { next: { revalidate: 3600 } });

//     if (!response.ok) {
//       console.error(`Error fetching sitemap data: ${response.status} ${response.statusText}`);
//     } else {
//       // Cast to the specific type representing the actual API response
//       const faqsData = (await response.json()) as FaqSitemapData[];
//       console.log(`Fetched ${faqsData.length} FAQs for sitemap.`);

//       faqUrls = faqsData
//         // Ensure slug is present (though API should guarantee it)
//         .filter(faq => faq.slug)
//         .map((faq) => ({
//           url: `${baseUrl}/faq/${faq.slug}`, // Use the required slug
//           lastModified: new Date(faq.updated_at),
//           changeFrequency: "monthly" as const,
//           priority: 0.8,
//         }));
//     } 
//   } catch (error) {
//     console.error("Failed to fetch or process sitemap FAQ data:", error);
//   }

//   const staticUrls: MetadataRoute.Sitemap = [
//     { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
//     // Add other static pages...
//   ];

//   return [...staticUrls, ...faqUrls];
// }