
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Car, Star, Loader2, User } from 'lucide-react';
import { API_BASE_URL } from '@/config';

interface DashboardData {
  user?: { name: string };
  jumlah_mobil?: number;
  jumlah_feedback_bintang_5?: number;
  message?: string;
}

export default function DashboardPage() {
  const { user: authUser, fetchWithAuth } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/admin/dashboard`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error: ${response.status}`);
        }
        const result: DashboardData = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat data dasbor.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchWithAuth]);
  
  const displayName = data?.user?.name || authUser?.name || 'Admin';

  return (
    <AppLayout>
      <div className="space-y-8"> 
        <h1 className="text-3xl font-bold tracking-tight">Selamat datang, {displayName}!</h1>
        
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle /> Gagal Memuat Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && data && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">Total Mobil</CardTitle>
                <Car className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.jumlah_mobil ?? 'N/A'}</div>
                <p className="text-xs text-muted-foreground">Jumlah total mobil terdaftar</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">Ulasan Bintang 5</CardTitle>
                <Star className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.jumlah_feedback_bintang_5 ?? 'N/A'}</div>
                <p className="text-xs text-muted-foreground">Ulasan pelanggan dengan rating tinggi</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">Pengguna Masuk</CardTitle>
                <User className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-semibold">{authUser?.name}</div>
                <p className="text-xs text-muted-foreground">{authUser?.email}</p>
              </CardContent>
            </Card>
          </div>
        )}
         {!isLoading && !error && !data && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">Data Tidak Tersedia</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Data dasbor tidak dapat dimuat atau kosong.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </AppLayout>
  );
}
