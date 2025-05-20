
import { z } from 'zod';
import { CAR_CATEGORIES, TRANSMISSION_TYPES, CAR_STATUSES } from '@/types/mobil';

export const carSchema = z.object({
  plat_number: z.string().max(20, "Max 20 characters").optional().nullable().or(z.literal('')),
  category: z.enum(CAR_CATEGORIES, {
    required_error: "Category is required.",
  }),
  merk: z.string().min(1, "Merk is required.").max(100, "Max 100 characters"),
  model: z.string().min(1, "Model is required.").max(100, "Max 100 characters"),
  year: z.coerce
    .number({ invalid_type_error: "Year must be a number." })
    .int()
    .min(1900, "Year must be 1900 or later.")
    .max(new Date().getFullYear() + 1, `Year cannot be in the future beyond ${new Date().getFullYear() + 1}.`),
  transmission: z.enum(TRANSMISSION_TYPES, {
    required_error: "Transmission is required.",
  }),
  seat: z.coerce
    .number({ invalid_type_error: "Seat capacity must be a number." })
    .int()
    .min(1, "Seat capacity must be at least 1."),
  description: z.string().optional().nullable().or(z.literal('')),
  status: z.enum(CAR_STATUSES, {
    required_error: "Status is required.",
  }),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number." })
    .min(0, "Price must be non-negative."),
  picture_upload: z.any().optional().nullable(), // Changed from string URL to any for FileList object
});

export type CarFormValues = z.infer<typeof carSchema>;
