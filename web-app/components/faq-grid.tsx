import FaqItem from "./faq-item";
// import { faqData } from "@/lib/data";
import type { Faq } from "@/types/schema";


async function getFaqs() {
  const apiUrl = process.env.API_URL; // → "http://backend:8000"

  const res = await fetch(`${apiUrl}/api/faqs?limit=20&randomize=false`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }); 
 
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error('Failed to fetch data', {
      cause: new Error(errorData.message),
    })
  }
  return res.json()
}
 

export default async function FaqGrid() {
  const faqs: Faq[] = await getFaqs();

  return (
    <>  
      {/* if faqs is null display null, else display a text */}
      <div className="text-start w-full flex flex-col items-start justify-start">
      {faqs.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>
            No hay preguntas frecuentes disponibles en este momento.
          </p>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>
            Preguntas frecuentes
          </p>
        </div>
      )}
      </div>

      {/* if faqs is different than null, display a text */}
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 gap-y-0 mt-6">
      {faqs.map((item) => (
        <FaqItem
          key={item.id}
          id={item.id}
          question={item.question}
          answer={item.answer}
          // isOpen={openItems.includes(item.id)}
          // onToggle={() => toggleItem(item.id)}
        />
      ))}
    </div>
    </>
  );
}
