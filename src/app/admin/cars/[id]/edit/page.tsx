
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { CarForm } from '@/components/cars/CarForm';
import { CarFormValues } from '@/lib/schemas/carSchema';
import { Mobil, MobilDetailResponse } from '@/types/mobil';
import { API_BASE_URL } from '@/config';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditCarPage() {
  const [car, setCar] = useState<Mobil | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchWithAuth } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const carId = params.id as string;

  const fetchCarData = useCallback(async () => {
    if (!carId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/mobils/${carId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memuat data mobil.');
      }
      const result: MobilDetailResponse = await response.json();
      setCar(result.data);
    } catch (err: any) {
      setError(err.message);
      console.error("Fetch car error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [carId, fetchWithAuth]);

  useEffect(() => {
    fetchCarData();
  }, [fetchCarData]);

  const onSubmit = async (values: CarFormValues) => {
    if (!carId) return;
    setIsSubmitting(true);
    const formData = new FormData();

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
    
    formData.append('_method', 'PUT');

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/mobils/${carId}`, {
        method: 'POST', 
        body: formData,
      });
      
      const data = await response.json();

      if (!response.ok) {
         if (response.status === 422 && data.errors) {
           const errorMessages = Object.values(data.errors).flat().join(' ');
           throw new Error(errorMessages || 'Validasi gagal');
        }
        throw new Error(data.message || 'Gagal memperbarui mobil.');
      }
      toast({
        title: 'Sukses!',
        description: 'Mobil berhasil diperbarui.',
      });
      router.push('/admin/cars');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Terjadi kesalahan tak terduga.',
        variant: 'destructive',
      });
      console.error("Update car error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
           <p className="ml-2">Memuat detail mobil...</p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
         <div className="space-y-6">
            <div className="flex items-center justify-between">
                 <h1 className="text-3xl font-bold">Ubah Mobil</h1>
                 <Button variant="outline" asChild>
                    <Link href="/admin/cars">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Daftar Mobil
                    </Link>
                </Button>
            </div>
            <Card className="border-destructive bg-destructive/10">
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle /> Gagal Memuat Mobil
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-destructive">{error}</p>
                 <Button onClick={fetchCarData} className="mt-4">Coba Lagi</Button>
                </CardContent>
            </Card>
        </div>
      </AppLayout>
    );
  }

  if (!car) {
     return (
      <AppLayout>
         <div className="space-y-6">
            <div className="flex items-center justify-between">
                 <h1 className="text-3xl font-bold">Ubah Mobil</h1>
                 <Button variant="outline" asChild>
                    <Link href="/admin/cars">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Daftar Mobil
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader><CardTitle>Mobil Tidak Ditemukan</CardTitle></CardHeader>
                <CardContent><p>Mobil yang ingin Anda ubah tidak dapat ditemukan.</p></CardContent>
            </Card>
        </div>
      </AppLayout>
    );
  }


  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Ubah Mobil (ID: {car.id})</h1>
            <Button variant="outline" asChild>
                <Link href="/admin/cars">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar Mobil
                </Link>
            </Button>
        </div>
        <CarForm
          onSubmit={onSubmit}
          initialData={car}
          isSubmitting={isSubmitting}
          submitButtonText="Perbarui Mobil"
          formTitle={`Mengubah: ${car.merk} ${car.model}`}
          formDescription="Perbarui detail mobil di bawah ini. Untuk mengganti gambar, unggah file baru."
        />
      </div>
    </AppLayout>
  );
}
