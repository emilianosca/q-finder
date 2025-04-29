"use server";

import { revalidatePath } from "next/cache";

interface CreateFaqPayload {
  question: string;
  answer: string;
}

interface FaqResponse {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export async function createFaq(
  payload: CreateFaqPayload
): Promise<{ success: boolean; data?: FaqResponse; error?: string }> {
  console.log("Creating FAQ with payload:", payload);

  try {
    // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const apiUrl = process.env.API_URL; // → "http://backend:8000"

    console.log("API URL:", apiUrl);

    const response = await fetch(`${apiUrl}/api/faq`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Response from API:", response);

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.detail || "Failed to create FAQ",
      };
    }

    const data = await response.json();

    console.log("Created FAQ data:", data);
    
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
