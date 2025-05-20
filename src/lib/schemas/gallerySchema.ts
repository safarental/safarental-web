
import { z } from 'zod';

export const gallerySchema = z.object({
  title: z.string().min(1, "Title is required.").max(255, "Title cannot exceed 255 characters."),
  description: z.string().optional().nullable().or(z.literal('')),
  picture_upload: z.any().optional().nullable(), // For FileList object from file input
});

export type GalleryFormValues = z.infer<typeof gallerySchema>;
