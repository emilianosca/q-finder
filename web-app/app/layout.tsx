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

export const metadata: Metadata = {
  title: "Q Finder - Encuentra tus preguntas",
  description:
    "Somos un buscador de preguntas y respuestas para la comunidad de Q&A.",
  openGraph: {
    title: "Q Finder - Encuentra tus preguntas",
    description:
      "Somos un buscador de preguntas y respuestas para la comunidad de Q&A.",
    type: "website",
    url: "https://untitledui.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${merriweather.variable} font-sans antialiased min-h-screen bg-white`}
      >
        <Navbar />

        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
