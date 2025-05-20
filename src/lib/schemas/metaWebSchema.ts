
import { z } from 'zod';

export const metaWebSchema = z.object({
  website_name: z.string().min(1, "Website name is required.").max(255, "Max 255 characters"),
  description: z.string().optional().nullable().or(z.literal('')),
  vision: z.string().optional().nullable().or(z.literal('')),
  mission: z.string().optional().nullable().or(z.literal('')),
  email: z.string().email({ message: "Invalid email address." }).optional().nullable().or(z.literal('')),
  phone: z.string().max(20, "Max 20 characters").optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable().or(z.literal('')),
  whatsapp: z.string().max(20, "Max 20 characters").optional().nullable().or(z.literal('')),
  instagram: z.string().max(100, "Max 100 characters").optional().nullable().or(z.literal('')),
  facebook: z.string().max(100, "Max 100 characters").optional().nullable().or(z.literal('')),
});

export type MetaWebFormValues = z.infer<typeof metaWebSchema>;
