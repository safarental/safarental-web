
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { GalleryForm } from '@/components/galleries/GalleryForm';
import type { GalleryFormValues } from '@/lib/schemas/gallerySchema';
import { API_BASE_URL } from '@/config';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CreateGalleryItemPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchWithAuth } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (values: GalleryFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();

    formData.append('title', values.title);
    formData.append('description', values.description || '');
    
    const pictureFile = values.picture_upload?.[0] as File | undefined;
    if (pictureFile) {
      formData.append('picture_upload', pictureFile);
    }

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/galleries`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
           const errorMessages = Object.values(data.errors).flat().join(' ');
           throw new Error(errorMessages || 'Validasi gagal');
        }
        throw new Error(data.message || 'Gagal membuat item galeri.');
      }

      toast({
        title: 'Sukses!',
        description: 'Item galeri berhasil dibuat.',
      });
      router.push('/admin/galleries');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Terjadi kesalahan tak terduga.',
        variant: 'destructive',
      });
      console.error("Create gallery item error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Buat Item Galeri Baru</h1>
            <Button variant="outline" asChild>
                <Link href="/admin/galleries">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar Galeri
                </Link>
            </Button>
        </div>
        <GalleryForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitButtonText="Buat Item"
          formTitle="Tambah Item Galeri Baru"
          formDescription="Mohon isi semua field yang wajib diisi untuk menambahkan item baru ke galeri."
        />
      </div>
    </AppLayout>
  );
}
