
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { feedbackSchema, type FeedbackFormValues } from '@/lib/schemas/feedbackSchema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Star } from 'lucide-react';

export function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: '',
      email: '',
      rate: undefined, // Initially no rating selected
      feedback: '',
    },
  });

  async function onSubmit(values: FeedbackFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/write-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 422 && responseData.errors) {
          // Handle validation errors
          const errorMessages = Object.values(responseData.errors).flat().join(' ');
          throw new Error(errorMessages || 'Validasi gagal. Periksa kembali isian Anda.');
        }
        throw new Error(responseData.message || 'Terjadi kesalahan saat mengirim feedback.');
      }

      toast({
        title: 'Sukses!',
        description: responseData.message || 'Feedback Anda telah berhasil dikirim. Terima kasih!',
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: 'Gagal Mengirim Feedback',
        description: error.message || 'Terjadi kesalahan yang tidak diketahui.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Bagikan Pendapat Anda</CardTitle>
        <CardDescription>Kami sangat menghargai setiap masukan untuk menjadi lebih baik.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Anda</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama lengkap Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="cth: nama@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Rating Anda (1-5 Bintang)</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                      className="flex space-x-2 items-center"
                    >
                      {[1, 2, 3, 4, 5].map((rateValue) => (
                        <FormItem key={rateValue} className="flex items-center space-x-1 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={rateValue.toString()} id={`rate-${rateValue}`} />
                          </FormControl>
                          <FormLabel htmlFor={`rate-${rateValue}`} className="font-normal flex items-center cursor-pointer">
                            {rateValue} <Star className="ml-1 h-4 w-4 text-yellow-400 fill-yellow-400" />
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pesan Feedback (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tuliskan pendapat atau masukan Anda di sini..."
                      className="resize-none"
                      rows={4}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kirim Feedback
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
