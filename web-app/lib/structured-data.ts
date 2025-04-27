export function generateFaqStructuredData(question: string, answer: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: {
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    },
  };
}

export function generateFaqPageStructuredData(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
