
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { FaqForm } from '@/components/faqs/FaqForm';
import type { FaqFormValues } from '@/lib/schemas/faqSchema';
import type { Faq, FaqDetailResponse } from '@/types/faq';
import { API_BASE_URL } from '@/config';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditFaqPage() {
  const [faq, setFaq] = useState<Faq | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchWithAuth } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const faqId = params.id as string;

  const fetchFaqData = useCallback(async () => {
    if (!faqId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/faqs/${faqId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memuat data FAQ.');
      }
      const result: FaqDetailResponse = await response.json();
      setFaq(result.data);
    } catch (err: any) {
      setError(err.message);
      console.error("Fetch FAQ error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [faqId, fetchWithAuth]);

  useEffect(() => {
    fetchFaqData();
  }, [fetchFaqData]);

  const onSubmit = async (values: FaqFormValues) => {
    if (!faqId) return;
    setIsSubmitting(true);
    
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/faqs/${faqId}`, {
        method: 'PUT', 
        body: JSON.stringify(values),
      });
      
      const data = await response.json();

      if (!response.ok) {
         if (response.status === 422 && data.errors) {
           const errorMessages = Object.values(data.errors).flat().join(' ');
           throw new Error(errorMessages || 'Validasi gagal');
        }
        throw new Error(data.message || 'Gagal memperbarui FAQ.');
      }
      toast({
        title: 'Sukses!',
        description: 'FAQ berhasil diperbarui.',
      });
      router.push('/admin/faqs');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Terjadi kesalahan tak terduga.',
        variant: 'destructive',
      });
      console.error("Update FAQ error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
           <p className="ml-2">Memuat detail FAQ...</p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
         <div className="space-y-6">
            <div className="flex items-center justify-between">
                 <h1 className="text-3xl font-bold">Ubah FAQ</h1>
                 <Button variant="outline" asChild>
                    <Link href="/admin/faqs">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Daftar FAQ
                    </Link>
                </Button>
            </div>
            <Card className="border-destructive bg-destructive/10">
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle /> Gagal Memuat FAQ
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-destructive">{error}</p>
                 <Button onClick={fetchFaqData} className="mt-4">Coba Lagi</Button>
                </CardContent>
            </Card>
        </div>
      </AppLayout>
    );
  }

  if (!faq) {
     return (
      <AppLayout>
         <div className="space-y-6">
            <div className="flex items-center justify-between">
                 <h1 className="text-3xl font-bold">Ubah FAQ</h1>
                 <Button variant="outline" asChild>
                    <Link href="/admin/faqs">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Daftar FAQ
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader><CardTitle>FAQ Tidak Ditemukan</CardTitle></CardHeader>
                <CardContent><p>FAQ yang ingin Anda ubah tidak dapat ditemukan.</p></CardContent>
            </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Ubah FAQ (ID: {faq.id})</h1>
            <Button variant="outline" asChild>
                <Link href="/admin/faqs">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar FAQ
                </Link>
            </Button>
        </div>
        <FaqForm
          onSubmit={onSubmit}
          initialData={faq}
          isSubmitting={isSubmitting}
          submitButtonText="Perbarui FAQ"
          formTitle={`Mengubah FAQ ID: ${faq.id}`}
          formDescription="Perbarui pertanyaan dan jawaban di bawah ini."
        />
      </div>
    </AppLayout>
  );
}
