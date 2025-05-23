
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import type { Faq, FaqDetailResponse } from '@/types/faq';
import { API_BASE_URL } from '@/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Loader2, AlertTriangle, MessageSquare, CheckSquare } from 'lucide-react';

export default function ViewFaqPage() {
  const [faq, setFaq] = useState<Faq | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchWithAuth } = useAuth();
  const params = useParams();
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
                 <h1 className="text-3xl font-bold">Lihat FAQ</h1>
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
                 <h1 className="text-3xl font-bold">Lihat FAQ</h1>
                 <Button variant="outline" asChild>
                    <Link href="/admin/faqs">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Daftar FAQ
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader><CardTitle>FAQ Tidak Ditemukan</CardTitle></CardHeader>
                <CardContent><p>FAQ yang ingin Anda lihat tidak dapat ditemukan.</p></CardContent>
            </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold">Detail FAQ</h1>
                <p className="text-muted-foreground">Detail untuk FAQ ID: {faq.id}</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href="/admin/faqs">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar
                    </Link>
                </Button>
                <Button asChild>
                    <Link href={`/admin/faqs/${faq.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Ubah FAQ
                    </Link>
                </Button>
            </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-primary">
              <MessageSquare className="h-6 w-6" /> Pertanyaan
            </CardTitle>
            <CardDescription className="pt-2 text-lg text-foreground">{faq.questions}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-primary mb-2">
                <CheckSquare className="h-6 w-6" /> Jawaban
            </h3>
            <div className="prose max-w-none text-foreground">
                <p>{faq.answer}</p>
            </div>
          </CardContent>
           <CardFooter className="bg-muted/30 p-4 text-xs text-muted-foreground flex justify-between">
            <span>Dibuat: {faq.created_at ? new Date(faq.created_at).toLocaleString('id-ID') : 'N/A'}</span>
            <span>Terakhir Diperbarui: {faq.updated_at ? new Date(faq.updated_at).toLocaleString('id-ID') : 'N/A'}</span>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
