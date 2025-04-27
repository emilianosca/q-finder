"use client"

import Link from "next/link"
import { Minus, Plus } from 'lucide-react'

interface FaqItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  id: number
}

export default function FaqItem({ question, answer, isOpen, onToggle, id }: FaqItemProps) {
  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Link href={`/faq/${id}`} className="group">
            <h3 className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors">
              {question}
              <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </h3>
          </Link>
          <div
            id={`answer-${question.replace(/\s+/g, "-").toLowerCase()}`}
            className={`mt-2 text-gray-600 ${isOpen ? "block" : "hidden"}`}
          >
            <p className="text-sm">{answer}</p>
            <Link href={`/faq/${id}`} className="text-sm text-gray-500 hover:text-black mt-2 inline-block">
              View full answer →
            </Link>
          </div>
        </div>
        <button
          className="ml-4 flex-shrink-0 mt-1"
          aria-expanded={isOpen}
          aria-controls={`answer-${question.replace(/\s+/g, "-").toLowerCase()}`}
          onClick={onToggle}
        >
          {isOpen ? <Minus className="h-5 w-5 text-gray-500" /> : <Plus className="h-5 w-5 text-gray-500" />}
        </button>
      </div>
    </div>
  )
}

