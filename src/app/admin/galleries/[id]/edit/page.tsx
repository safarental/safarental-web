
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { GalleryForm } from '@/components/galleries/GalleryForm';
import type { GalleryFormValues } from '@/lib/schemas/gallerySchema';
import type { Gallery, GalleryDetailResponse } from '@/types/gallery';
import { API_BASE_URL } from '@/config';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditGalleryItemPage() {
  const [galleryItem, setGalleryItem] = useState<Gallery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchWithAuth } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const galleryItemId = params.id as string;

  const fetchGalleryItemData = useCallback(async () => {
    if (!galleryItemId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/galleries/${galleryItemId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memuat data item galeri.');
      }
      const result: GalleryDetailResponse = await response.json();
      setGalleryItem(result.data);
    } catch (err: any) {
      setError(err.message);
      console.error("Fetch gallery item error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [galleryItemId, fetchWithAuth]);

  useEffect(() => {
    fetchGalleryItemData();
  }, [fetchGalleryItemData]);

  const onSubmit = async (values: GalleryFormValues) => {
    if (!galleryItemId) return;
    setIsSubmitting(true);
    const formData = new FormData();

    formData.append('title', values.title);
    formData.append('description', values.description || '');
    
    const pictureFile = values.picture_upload?.[0] as File | undefined;
    if (pictureFile) {
      formData.append('picture_upload', pictureFile);
    }
    formData.append('_method', 'PUT');

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/galleries/${galleryItemId}`, {
        method: 'POST', 
        body: formData,
      });
      
      const data = await response.json();

      if (!response.ok) {
         if (response.status === 422 && data.errors) {
           const errorMessages = Object.values(data.errors).flat().join(' ');
           throw new Error(errorMessages || 'Validasi gagal');
        }
        throw new Error(data.message || 'Gagal memperbarui item galeri.');
      }
      toast({
        title: 'Sukses!',
        description: 'Item galeri berhasil diperbarui.',
      });
      router.push('/admin/galleries');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Terjadi kesalahan tak terduga.',
        variant: 'destructive',
      });
      console.error("Update gallery item error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
           <p className="ml-2">Memuat detail item galeri...</p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
         <div className="space-y-6">
            <div className="flex items-center justify-between">
                 <h1 className="text-3xl font-bold">Ubah Item Galeri</h1>
                 <Button variant="outline" asChild>
                    <Link href="/admin/galleries">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Daftar Galeri
                    </Link>
                </Button>
            </div>
            <Card className="border-destructive bg-destructive/10">
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle /> Gagal Memuat Item
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-destructive">{error}</p>
                 <Button onClick={fetchGalleryItemData} className="mt-4">Coba Lagi</Button>
                </CardContent>
            </Card>
        </div>
      </AppLayout>
    );
  }

  if (!galleryItem) {
     return (
      <AppLayout>
         <div className="space-y-6">
            <div className="flex items-center justify-between">
                 <h1 className="text-3xl font-bold">Ubah Item Galeri</h1>
                 <Button variant="outline" asChild>
                    <Link href="/admin/galleries">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Daftar Galeri
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader><CardTitle>Item Galeri Tidak Ditemukan</CardTitle></CardHeader>
                <CardContent><p>Item galeri yang ingin Anda ubah tidak dapat ditemukan.</p></CardContent>
            </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Ubah Item Galeri (ID: {galleryItem.id})</h1>
            <Button variant="outline" asChild>
                <Link href="/admin/galleries">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar Galeri
                </Link>
            </Button>
        </div>
        <GalleryForm
          onSubmit={onSubmit}
          initialData={galleryItem}
          isSubmitting={isSubmitting}
          submitButtonText="Perbarui Item"
          formTitle={`Mengubah: ${galleryItem.title}`}
          formDescription="Perbarui detail item galeri di bawah ini. Untuk mengganti gambar, unggah file baru."
        />
      </div>
    </AppLayout>
  );
}
