"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { createFaq } from "@/actions/new_faq";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CreateFaqPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
    setError(null);
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!question.trim()) {
      setError("Question is required");
      return;
    }

    if (!answer.trim()) {
      setError("Answer is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createFaq({
        question: question.trim(),
        answer: answer.trim(),
      });

      if (result.success) {
        toast({
          title: "FAQ created successfully",
          description: "Your FAQ has been published and is now available.",
        });
        router.push("/");
      } else {
        setError(result.error || "Failed to create FAQ");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const MAX_QUESTION_LENGTH = 300;

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-medium">
            Crea una nueva pregunta
          </h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="basic" className="mb-6">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="basic">Edita tu pregunta</TabsTrigger>
            <TabsTrigger value="preview">Preview de tu pregunta</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div>
                  <label className="text-sm text-gray-500 my-4">
                    Pregunta
                    <span className="text-red-500 space-x-0.5">*</span>
                    (máx. de 300 caracteres)
                  </label>
                  <Input
                    placeholder="Ingresa tu pregunta"
                    className="text-lg py-6 px-4 border-gray-200 rounded-lg mt-3"
                    value={question}
                    onChange={handleQuestionChange}
                    maxLength={MAX_QUESTION_LENGTH}
                    required
                  />
                  <div
                    className={`text-sm w-full flex justify-end mt-3 ${
                      question.length > MAX_QUESTION_LENGTH * 0.9
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {question.length}/{MAX_QUESTION_LENGTH}
                  </div>
                </div>
              </div>

              <label className="text-sm text-gray-500 my-4">
                Respuesta * (requerida)
              </label>
              <Card className="mb-6 border-gray-200 mt-4">
                <CardContent className="p-0">
                  <Textarea
                    placeholder="Ingresa tu respuesta"
                    className="min-h-[300px] border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                    value={answer}
                    onChange={handleAnswerChange}
                    required
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posteando tu pregunta...
                    </>
                  ) : (
                    "Crear pregunta"
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4">
                  {question || "Your question will appear here"}
                </h2>
                <div className="prose">
                  <p>{answer || "Your answer will appear here"}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
