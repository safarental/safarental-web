
"use client";

import * as z from 'zod';

export const feedbackSchema = z.object({
  name: z.string().min(1, { message: 'Nama wajib diisi.' }).max(255, { message: 'Nama tidak boleh lebih dari 255 karakter.' }),
  email: z.string().email({ message: 'Format email tidak valid.' }).min(1, { message: 'Email wajib diisi.' }),
  rate: z.coerce
    .number({ required_error: "Rating wajib dipilih.", invalid_type_error: "Rating harus berupa angka." })
    .int()
    .min(1, { message: 'Rating minimal adalah 1 bintang.' }) // Updated error message
    .max(5, { message: 'Rating maksimal adalah 5 bintang.' }), // Updated error message
  feedback: z.string().optional().nullable(),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
