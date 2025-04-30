"use client";

import Link from "next/link";
import { Minus } from "lucide-react";

interface FaqItemProps {
  question: string;
  answer: string;
  // isOpen: boolean;
  // onToggle: () => void;
  id: number;
}

export default function FaqItem({
  question,
  answer,
  // isOpen,
  // onToggle,
  id,
}: FaqItemProps) {
  return (
    <div className="border-b border-gray-200 py-4">
      <Link href={`/faq/${id}`} className="group">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900  hover:text-black transition-colors  line-clamp-1">
              {question}
              <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </h3>

            <div
              id={`answer-${question.replace(/\s+/g, "-").toLowerCase()}`}
              className={`mt-2 text-gray-600 line-clamp-2  hover:text-black transition-colors `}
            >
              <p className="text-sm">{answer}</p>
              {/* <Link href={`/faq/${id}`} className="text-sm text-gray-500 hover:text-black mt-2 inline-block"> */}
            </div>
            <p className="text-sm text-gray-500 hover:text-black mt-2 inline-block">
              Ver pregunta completa
              <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </p>
          </div>
          <Minus className="h-5 w-5 text-gray-500 hover:" />
        </div>
      </Link>
    </div>
  );
}
