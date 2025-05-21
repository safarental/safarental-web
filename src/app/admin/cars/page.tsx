
"use client"; 

import { Suspense, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { CarsTable } from '@/components/cars/CarsTable';
import { Button } from '@/components/ui/button';
import { PaginatedCarsResponse } from '@/types/mobil';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config';
import { Loader2, PlusCircle, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function CarsPageContent() {
  const [carsResponse, setCarsResponse] = useState<PaginatedCarsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const fetchCars = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/mobils?page=${page}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      const data: PaginatedCarsResponse = await response.json();
      setCarsResponse(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data mobil.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    fetchCars(currentPage);
  }, [currentPage, fetchCars]);

  const handleDeleteCar = async (id: number) => {
    setIsDeleting(id);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/mobils/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal menghapus mobil.');
      }
      toast({
        title: 'Sukses!',
        description: 'Mobil berhasil dihapus.',
      });
      if (carsResponse?.data.data.length === 1 && currentPage > 1) {
        router.push(`/admin/cars?page=${currentPage - 1}`);
      } else {
        fetchCars(currentPage);
      }
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

  const handlePageChange = (newPage: number) => {
    router.push(`/admin/cars?page=${newPage}`);
  };

  return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Manajemen Mobil</h1>
          <Button asChild>
            <Link href="/admin/cars/create">
              <PlusCircle className="mr-2 h-5 w-5" />
              Tambah Mobil Baru
            </Link>
          </Button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-2">Memuat mobil...</p>
          </div>
        )}

        {error && !isLoading && (
          <Card className="border-destructive bg-destructive/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle /> Gagal Memuat Mobil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">{error}</p>
              <Button onClick={() => fetchCars(currentPage)} className="mt-4">Coba Lagi</Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && carsResponse && (
          <>
            <CarsTable carsResponse={carsResponse} onDelete={handleDeleteCar} isDeleting={isDeleting} />
            {carsResponse.data.total > carsResponse.data.per_page && (
                <div className="flex items-center justify-between pt-4">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {carsResponse.data.from} hingga {carsResponse.data.to} dari {carsResponse.data.total} hasil
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!carsResponse.data.prev_page_url}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Sebelumnya
                        </Button>
                        <span className="text-sm">Halaman {currentPage} dari {carsResponse.data.last_page}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!carsResponse.data.next_page_url}
                        >
                            Berikutnya
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
          </>
        )}
      </div>
  );
}

export default function CarsPageWrapper() {
  return (
    <AppLayout>
      <Suspense fallback={
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-2">Memuat daftar mobil...</p>
        </div>
      }>
        <CarsPageContent />
      </Suspense>
    </AppLayout>
  );
}
