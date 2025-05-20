
import { z } from 'zod';

export const faqSchema = z.object({
  questions: z.string().min(1, "Question is required."),
  answer: z.string().min(1, "Answer is required."),
});

export type FaqFormValues = z.infer<typeof faqSchema>;
