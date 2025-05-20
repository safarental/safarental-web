
"use client";
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { FaqsTable } from '@/components/faqs/FaqsTable';
import { Button } from '@/components/ui/button';
import type { FaqsResponse } from '@/types/faq';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config';
import { Loader2, PlusCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FaqsPage() {
  const [faqsResponse, setFaqsResponse] = useState<FaqsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useAuth();
  const { toast } = useToast();

  const fetchFaqs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/faqs`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      const data: FaqsResponse = await response.json();
      setFaqsResponse(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat FAQ.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleDeleteFaq = async (id: number) => {
    setIsDeleting(id);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/faqs/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal menghapus FAQ.');
      }
      toast({
        title: 'Sukses!',
        description: 'FAQ berhasil dihapus.',
      });
      fetchFaqs(); 
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Terjadi kesalahan tak terduga.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Manajemen Tanya Jawab (FAQ)</h1>
          <Button asChild>
            <Link href="/admin/faqs/create">
              <PlusCircle className="mr-2 h-5 w-5" />
              Tambah FAQ Baru
            </Link>
          </Button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-2">Memuat FAQ...</p>
          </div>
        )}

        {error && !isLoading && (
          <Card className="border-destructive bg-destructive/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle /> Gagal Memuat FAQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">{error}</p>
              <Button onClick={fetchFaqs} className="mt-4">Coba Lagi</Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && faqsResponse && (
          <FaqsTable faqsResponse={faqsResponse} onDelete={handleDeleteFaq} isDeleting={isDeleting} />
        )}
      </div>
    </AppLayout>
  );
}
