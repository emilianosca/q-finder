import FaqItem from "./faq-item";
import type { Faq } from "@/types/schema";
import { BACKEND_API_BASE_URL } from "@/lib/api";


async function getFaqs() {
  // const apiUrl = process.env.API_URL; // → "http://backend:8000"

  const res = await fetch(`${BACKEND_API_BASE_URL}/api/faqs?limit=20&randomize=false`, {
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


// "use client";

// import React from "react";
// import useSWR from "swr";
// import { Loader2 } from "lucide-react";
// import FaqItem from "./faq-item";
// import type { Faq } from "@/types/schema";
// import { API_BASE_URL } from "@/lib/api";

// // SWR fetcher helper
// const fetcher = (url: string): Promise<Faq[]> =>
//   fetch(url).then((res) => {
//     if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
//     return res.json();
//   });

// export default function FaqGrid() {
//   const apiUrl = `${API_BASE_URL}/api/faqs?limit=20&randomize=false`;
//   const { data: faqs, error, isValidating } = useSWR<Faq[]>(apiUrl, fetcher);

//   // Loading state
//   const isLoading = isValidating && !faqs;
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center mt-6">
//         <Loader2 className="animate-spin mr-2 h-5 w-5 text-gray-500" />
//         <span className="text-gray-500">Cargando preguntas frecuentes…</span>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="text-red-600 text-center mt-6">
//         <p>Ups, hubo un error al cargar las preguntas frecuentes.</p>
//       </div>
//     );
//   }

//   // Render once data is loaded
//   return (
//     <>
//       {/* Header */}
//       <div className="text-start w-full flex flex-col items-start justify-start">
//         {faqs && faqs.length === 0 ? (
//           <p className="text-gray-500">
//             No hay preguntas frecuentes disponibles en este momento.
//           </p>
//         ) : (
//           <p className="text-gray-500">Preguntas frecuentes</p>
//         )}
//       </div>

//       {/* FAQ Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 gap-y-0 mt-6">
//         {faqs?.map((item) => (
//           <FaqItem
//             key={item.id}
//             id={item.id}
//             question={item.question}
//             answer={item.answer}
//           />
//         ))}
//       </div>
//     </>
//   );
// }
