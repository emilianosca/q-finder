"use client"

import { useState } from "react"
import FaqItem from "./faq-item"
import { faqData } from "@/lib/data"

export default function FaqGrid() {
  const [openItems, setOpenItems] = useState<number[]>(faqData.map((item) => item.id))

  const toggleItem = (id: number) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 gap-y-0 mt-6">
      {faqData.map((item) => (
        <FaqItem
          key={item.id}
          id={item.id}
          question={item.question}
          answer={item.answer}
          isOpen={openItems.includes(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </div>
  )
}
