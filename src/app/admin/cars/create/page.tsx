
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { CarForm } from '@/components/cars/CarForm';
import { CarFormValues } from '@/lib/schemas/carSchema';
import { API_BASE_URL } from '@/config';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CreateCarPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchWithAuth } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (values: CarFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();

    // Append fields to FormData
    formData.append('category', values.category);
    formData.append('merk', values.merk);
    formData.append('model', values.model);
    formData.append('year', String(values.year));
    formData.append('transmission', values.transmission);
    formData.append('seat', String(values.seat));
    formData.append('status', values.status);
    formData.append('price', String(values.price));

    formData.append('plat_number', values.plat_number || '');
    formData.append('description', values.description || '');
    
    const pictureFile = values.picture_upload?.[0] as File | undefined;
    if (pictureFile) {
      formData.append('picture_upload', pictureFile);
    }

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/mobils`, {
        method: 'POST',
        body: formData, // Send FormData directly
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
           const errorMessages = Object.values(data.errors).flat().join(' ');
           throw new Error(errorMessages || 'Validasi gagal');
        }
        throw new Error(data.message || 'Gagal membuat mobil.');
      }

      toast({
        title: 'Sukses!',
        description: 'Mobil berhasil dibuat.',
      });
      router.push('/admin/cars');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Terjadi kesalahan tak terduga.',
        variant: 'destructive',
      });
      console.error("Create car error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Buat Mobil Baru</h1>
            <Button variant="outline" asChild>
                <Link href="/admin/cars">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar Mobil
                </Link>
            </Button>
        </div>
        <CarForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitButtonText="Buat Mobil"
          formTitle="Tambah Mobil Baru"
          formDescription="Mohon isi semua field yang wajib diisi untuk menambahkan mobil baru ke sistem."
        />
      </div>
    </AppLayout>
  );
}
