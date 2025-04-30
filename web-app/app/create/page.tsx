"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

import { createFaq } from "@/actions/new_faq";

export default function CreateFaqPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);

  // dialog & timing state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dialogStartRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | undefined>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const MAX_QUESTION_LENGTH = 300;

  // Handlers for form fields
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
    setError(null);
  };
  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
    setError(null);
  };

// Intercept form submit to show preview dialog
  const openPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return setError("Question is required");
    if (!answer.trim()) return setError("Answer is required");
    setError(null);

    setProgress(0);
    setIsConfirmed(false);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (!isDialogOpen) return;
    dialogStartRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - dialogStartRef.current;
      setProgress(Math.min(100, (elapsed / 4000) * 100));
    }, 100);
    timeoutRef.current = setTimeout(() => {
      setIsConfirmed(true);
    }, 4000);
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [isDialogOpen]);

  const handleConfirm = () => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
    setProgress(100);
    setIsConfirmed(true);
  };

  useEffect(() => {
    if (!isConfirmed) return;
    setIsSubmitting(true);
    createFaq({ question: question.trim(), answer: answer.trim() })
      .then((result) => {
        if (result.success) {
          toast({
            title: "Pregunta creada",
            description: "Tu pregunta ha sido creada con éxito.",
          });
          router.push("/");
        } else {
          setError(result.error || "Ups! Algo salió mal");
        }
      })
      .catch(() => {
        setError("Error al crear la pregunta");
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsDialogOpen(false);
        setIsConfirmed(false);
      });
  }, [isConfirmed, question, answer, router, toast]);

  const handleCancel = () => {
    setIsDialogOpen(false);
    setProgress(0);
    setIsConfirmed(false);
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
  };

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

        <form onSubmit={openPreview}>
          <div className="">
            <label className="text-sm text-gray-500">
              Pregunta <span className="text-red-500">*</span> (máx. de 300
              caracteres)
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

          <label className="text-sm text-gray-500">
            Respuesta <span className="text-red-500">*</span>
          </label>
          <Card className="mb-6 border-gray-200 mt-4">
            <CardContent className="p-0">
              <Textarea
                placeholder="Ingresa tu respuesta"
                className="min-h-[300px] resize-none border-0 focus-visible:ring-0"
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
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Vista previa de FAQ</DialogTitle>
            <DialogDescription>
              Se enviará esta pregunta después de 4 segundos, o puedes
              confirmarla inmediatamente.
            </DialogDescription>
          </DialogHeader>

          <div className="mb-4">
            <h3 className="font-semibold">Pregunta</h3>
            <p className="mt-1">{question}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Respuesta</h3>
            <p className="mt-1">{answer}</p>
          </div>

          <Progress value={progress} max={100} className="w-full mb-4" />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Confirmar y enviar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

