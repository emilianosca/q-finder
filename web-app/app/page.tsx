import FaqHeader from "@/components/faq-header";
import FaqSearch from "@/components/faq-search";
import FaqGrid from "@/components/faq-grid";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6 md:py-12 max-w-7xl">
      <div className="bg-[url('/grid-pattern.svg')] bg-[length:20px_20px] bg-repeat py-6 md:py-12">
        <FaqHeader />
        <FaqSearch />
      </div>
      <p className="text-base text-gray-500 hover:text-black mt-16 inline-block">
        Preguntas más recientes
      </p>
      <FaqGrid />
    </main>
  );
}
