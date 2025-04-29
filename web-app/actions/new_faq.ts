"use server";

import { revalidatePath } from "next/cache";
import type { Faq } from "@/types/schema";

interface CreateFaqPayload {
  question: string;
  answer: string;
}

export async function createFaq(
  payload: CreateFaqPayload
): Promise<{ success: boolean; data?: Faq; error?: string }> {

  try {
    const apiUrl = process.env.API_URL; // → "http://backend:8000"
    
    const response = await fetch(`${apiUrl}/api/faq`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.detail || "Failed to create FAQ",
      };
    }

    const data = await response.json();

    
    revalidatePath("/");

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
