
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { MetaWebForm } from '@/components/meta-web/MetaWebForm';
import type { MetaWebFormValues } from '@/lib/schemas/metaWebSchema';
import type { MetaWeb, MetaWebResponse } from '@/types/metaWeb';
import { API_BASE_URL } from '@/config';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MetaWebPage() {
  const [metaWebData, setMetaWebData] = useState<MetaWeb | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchWithAuth } = useAuth();
  const { toast } = useToast();

  const fetchMetaWebData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/meta-web`);
      if (!response.ok) {
        if (response.status === 404) {
          setMetaWebData(null); 
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memuat pengaturan website.');
      }
      const result: MetaWebResponse = await response.json();
      setMetaWebData(result.data);
    } catch (err: any) {
      setError(err.message);
      console.error("Fetch MetaWeb error:", err);
      setMetaWebData(null); 
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    fetchMetaWebData();
  }, [fetchMetaWebData]);

  const onSubmit = async (values: MetaWebFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/meta-web`, {
        method: 'POST',
        body: JSON.stringify(values),
      });
      
      const data: MetaWebResponse = await response.json();

      if (!response.ok) {
         if (response.status === 422 && (data as any).errors) {
           const errorMessages = Object.values((data as any).errors).flat().join(' ');
           throw new Error(errorMessages || 'Validasi gagal');
        }
        throw new Error(data.message || 'Gagal menyimpan pengaturan website.');
      }
      toast({
        title: 'Sukses!',
        description: data.message || 'Pengaturan website berhasil disimpan.',
      });
      setMetaWebData(data.data); 
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Terjadi kesalahan tak terduga.',
        variant: 'destructive',
      });
      console.error("Save MetaWeb error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
           <p className="ml-2">Memuat pengaturan website...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Pengaturan Website</h1>
            <Button variant="outline" onClick={fetchMetaWebData} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Muat Ulang Data
            </Button>
        </div>

        {error && !metaWebData && ( 
             <Card className="border-destructive bg-destructive/10">
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle /> Gagal Memuat Pengaturan
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-destructive">{error}</p>
                 <Button onClick={fetchMetaWebData} className="mt-4">Coba Lagi</Button>
                </CardContent>
            </Card>
        )}

        {(!error || metaWebData) && (
            <MetaWebForm
            onSubmit={onSubmit}
            initialData={metaWebData}
            isSubmitting={isSubmitting}
            formTitle="Kelola Informasi Website"
            formDescription={metaWebData ? "Perbarui informasi umum, detail kontak, dan tautan media sosial website Anda." : "Konfigurasikan pengaturan awal website Anda. Semua field bersifat opsional kecuali Nama Website."}
            />
        )}
      </div>
    </AppLayout>
  );
}
