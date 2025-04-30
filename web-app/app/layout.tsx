import type React from "react";
import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-serif",
});

// Base URL (Crucial for metadataBase and sitemap links)
const baseUrl = "http://localhost:3000";

// Metadata Object
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Q-Finder | Encuentra Respuestas Frecuentes", // Default title for pages without specific title
    template: "%s | Q-Finder", // Template for specific page titles (e.g., "Pricing | Q-Finder")
  },
  description:
    "Q-Finder es un buscador inteligente de preguntas y respuestas (FAQs) usando similitud vectorial. Encuentra la información que necesitas rápidamente.",
  openGraph: {
    title: {
      default: "Q-Finder | Encuentra Respuestas y Preguntas Frecuentes",
      template: "%s | Q-Finder",
    },
    description:
      "Busca y encuentra respuestas a preguntas frecuentes de forma eficiente con Q-Finder.",
    url: baseUrl, // The canonical URL for the site
    siteName: "Q-Finder",
    // this will now work with the current images, but you know just add them
    images: [
      {
        url: "/og-image.png", // Place in /public folder
        width: 1200,
        height: 630,
        alt: "Q-Finder Logo",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  robots: {
    // Standard good practice: allow indexing and following links
    index: true,
    follow: true,
    googleBot: {
      // instructions for Google
      index: true,
      follow: true,
      "max-video-preview": -1, // Allow any video preview length
      "max-image-preview": "large", // Allow large image previews
      "max-snippet": -1, // Allow any snippet length
    },
  },
  // this will now work with the current images, but you know just add them
  twitter: {
    card: "summary_large_image",
    title: "Q-Finder | Encuentra Respuestas Frecuentes",
    description:
      "Busca y encuentra respuestas a preguntas frecuentes de forma eficiente con Q-Finder.",
    images: ["/og-image.png"], // Must be absolute URL or start with '/'
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${merriweather.variable} font-sans antialiased min-h-screen bg-white`}
      >
        <Navbar />
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
