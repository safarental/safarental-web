
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FaqFormValues } from "@/lib/schemas/faqSchema";
import { faqSchema } from "@/lib/schemas/faqSchema";
import type { Faq } from "@/types/faq";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FaqFormProps {
  onSubmit: (values: FaqFormValues) => Promise<void>;
  initialData?: Faq | null;
  isSubmitting: boolean;
  submitButtonText?: string;
  formTitle?: string;
  formDescription?: string;
}

export function FaqForm({
  onSubmit,
  initialData,
  isSubmitting,
  submitButtonText = "Kirim",
  formTitle = "Detail FAQ",
  formDescription = "Isi detail untuk FAQ."
}: FaqFormProps) {
  const form = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: initialData
      ? {
          questions: initialData.questions || "",
          answer: initialData.answer || "",
        }
      : {
          questions: "",
          answer: "",
        },
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{formTitle}</CardTitle>
        <CardDescription>{formDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="questions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pertanyaan</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan pertanyaan..." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jawaban</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan jawaban..." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
