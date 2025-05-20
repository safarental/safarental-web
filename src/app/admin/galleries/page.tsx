
"use client";
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { GalleriesTable } from '@/components/galleries/GalleriesTable';
import { Button } from '@/components/ui/button';
import type { GalleriesResponse } from '@/types/gallery';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config';
import { Loader2, PlusCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GalleriesPage() {
  const [galleriesResponse, setGalleriesResponse] = useState<GalleriesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useAuth();
  const { toast } = useToast();

  const fetchGalleries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/galleries`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      const data: GalleriesResponse = await response.json();
      setGalleriesResponse(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat item galeri.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  const handleDeleteGalleryItem = async (id: number) => {
    setIsDeleting(id);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/galleries/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal menghapus item galeri.');
      }
      toast({
        title: 'Sukses!',
        description: 'Item galeri berhasil dihapus.',
      });
      fetchGalleries(); 
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
          <h1 className="text-3xl font-bold">Manajemen Galeri</h1>
          <Button asChild>
            <Link href="/admin/galleries/create">
              <PlusCircle className="mr-2 h-5 w-5" />
              Tambah Item Galeri Baru
            </Link>
          </Button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-2">Memuat item galeri...</p>
          </div>
        )}

        {error && !isLoading && (
          <Card className="border-destructive bg-destructive/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle /> Gagal Memuat Item Galeri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">{error}</p>
              <Button onClick={fetchGalleries} className="mt-4">Coba Lagi</Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && galleriesResponse && (
          <>
            <GalleriesTable galleriesResponse={galleriesResponse} onDelete={handleDeleteGalleryItem} isDeleting={isDeleting} />
            {galleriesResponse.data.length > 0 && (
                 <div className="flex items-center justify-end pt-4">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan {galleriesResponse.data.length} dari {galleriesResponse.data.length} hasil
                    </p>
                </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
