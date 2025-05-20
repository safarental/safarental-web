
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { AuthFormFields } from '@/components/AuthFormFields';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(1, { message: 'Nama diperlukan.' }).max(255),
  email: z.string().email({ message: 'Alamat email tidak valid.' }).max(255),
  password: z.string().min(8, { message: 'Kata sandi minimal 8 karakter.' }),
  password_confirmation: z.string().min(8, { message: 'Konfirmasi kata sandi minimal 8 karakter.' }),
}).refine(data => data.password === data.password_confirmation, {
  message: "Kata sandi tidak cocok",
  path: ["password_confirmation"], // Path to field to display error
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register, isLoading: authLoading, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/admin/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || (!authLoading && isAuthenticated)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await register(values.name, values.email, values.password, values.password_confirmation);
      // Redirect handled by AuthContext or the useEffect above
    } catch (error) {
      // Error handling by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background to-secondary">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Buat Akun</CardTitle>
          <CardDescription>Bergabunglah dengan Adminify hari ini dan kelola konten Anda dengan mudah.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AuthFormFields includeName includeConfirmPassword />
              <Button type="submit" className="w-full" disabled={isSubmitting || authLoading}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Daftar
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Masuk
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
