
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Mobil, MobilDetailResponse } from '@/types/mobil';
import { API_BASE_URL } from '@/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Loader2, AlertTriangle, Car, Tag, CalendarDays, Settings, Users, DollarSign, Info, ImageIcon } from 'lucide-react';

const getFullImageUrl = (relativePath: string | null | undefined): string | null => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  let appBaseUrl = API_BASE_URL;
  if (appBaseUrl.endsWith('/api')) {
    appBaseUrl = appBaseUrl.slice(0, -4);
  } else if (appBaseUrl.endsWith('/api/')) {
    appBaseUrl = appBaseUrl.slice(0, -5);
  }
  
  const cleanAppBaseUrl = appBaseUrl.endsWith('/') ? appBaseUrl.slice(0, -1) : appBaseUrl;
  const cleanRelativePath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  
  return `${cleanAppBaseUrl}/${cleanRelativePath}`;
};

export default function ViewCarPage() {
  const [car, setCar] = useState<Mobil | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchWithAuth } = useAuth();
  const params = useParams();
  const router = useRouter();
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
                 <h1 className="text-3xl font-bold">Lihat Mobil</h1>
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
                 <h1 className="text-3xl font-bold">Lihat Mobil</h1>
                 <Button variant="outline" asChild>
                    <Link href="/admin/cars">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Daftar Mobil
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader><CardTitle>Mobil Tidak Ditemukan</CardTitle></CardHeader>
                <CardContent><p>Mobil yang ingin Anda lihat tidak dapat ditemukan.</p></CardContent>
            </Card>
        </div>
      </AppLayout>
    );
  }

  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
    <div className="flex items-start space-x-3">
      <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-md font-medium">{value || 'N/A'}</p>
      </div>
    </div>
  );
  
  const getStatusVariant = (status: Mobil['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Available':
        return 'default'; 
      case 'Disewa':
        return 'secondary';
      case 'Out Of Order':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const imageSrc = getFullImageUrl(car.picture_upload) || `https://placehold.co/200x150.png`;
  const displayImageUrl = getFullImageUrl(car.picture_upload);


  return (
    <AppLayout>
      <div className="space-y-6">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold">{car.merk} {car.model}</h1>
                <p className="text-muted-foreground">Detail Mobil ID: {car.id}</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href="/admin/cars">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar
                    </Link>
                </Button>
                <Button asChild>
                    <Link href={`/admin/cars/${car.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Ubah Mobil
                    </Link>
                </Button>
            </div>
        </div>

        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-muted/30 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Image
                    src={imageSrc}
                    alt={`${car.merk} ${car.model}`}
                    width={200}
                    height={150}
                    className="rounded-lg object-cover border"
                    data-ai-hint="car photography"
                />
                <div>
                    <CardTitle className="text-2xl">{car.merk} {car.model}</CardTitle>
                    <CardDescription className="text-base">{car.category}</CardDescription>
                    <Badge variant={getStatusVariant(car.status)} className="mt-2 text-sm px-3 py-1">{car.status}</Badge>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            <DetailItem icon={Tag} label="Nomor Polisi" value={car.plat_number} />
            <DetailItem icon={CalendarDays} label="Tahun" value={car.year} />
            <DetailItem icon={Settings} label="Transmisi" value={car.transmission} />
            <DetailItem icon={Users} label="Kapasitas Kursi" value={`${car.seat} kursi`} />
            <DetailItem icon={DollarSign} label="Harga per Hari" value={`Rp ${car.price.toLocaleString('id-ID')}`} />
            <DetailItem 
                icon={ImageIcon} 
                label="URL Gambar" 
                value={displayImageUrl ? 
                    <a href={displayImageUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block max-w-xs">{displayImageUrl}</a> 
                    : 'N/A'} 
            />
            <div className="md:col-span-2 lg:col-span-3">
                 <DetailItem icon={Info} label="Deskripsi" value={car.description || 'Tidak ada deskripsi.'} />
            </div>
          </CardContent>
           <CardFooter className="bg-muted/30 p-4 text-xs text-muted-foreground flex justify-between">
            <span>Dibuat: {car.created_at ? new Date(car.created_at).toLocaleString('id-ID') : 'N/A'}</span>
            <span>Terakhir Diperbarui: {car.updated_at ? new Date(car.updated_at).toLocaleString('id-ID') : 'N/A'}</span>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
