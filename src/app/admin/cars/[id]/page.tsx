
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

const isValidHttpUrl = (string: string | null | undefined): boolean => {
  if (!string) return false;
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
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
        throw new Error(errorData.message || 'Failed to fetch car data.');
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
          <p className="ml-2">Loading car details...</p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                 <h1 className="text-3xl font-bold">View Car</h1>
                 <Button variant="outline" asChild>
                    <Link href="/admin/cars">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Car List
                    </Link>
                </Button>
            </div>
            <Card className="border-destructive bg-destructive/10">
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle /> Error Loading Car
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-destructive">{error}</p>
                <Button onClick={fetchCarData} className="mt-4">Retry</Button>
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
                 <h1 className="text-3xl font-bold">View Car</h1>
                 <Button variant="outline" asChild>
                    <Link href="/admin/cars">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Car List
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader><CardTitle>Car Not Found</CardTitle></CardHeader>
                <CardContent><p>The car you are trying to view could not be found.</p></CardContent>
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

  const imageSrc = isValidHttpUrl(car.picture_upload) 
    ? car.picture_upload!
    : `https://placehold.co/200x150.png`;

  return (
    <AppLayout>
      <div className="space-y-6">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold">{car.merk} {car.model}</h1>
                <p className="text-muted-foreground">Details for Car ID: {car.id}</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href="/admin/cars">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to List
                    </Link>
                </Button>
                <Button asChild>
                    <Link href={`/admin/cars/${car.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Car
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
            <DetailItem icon={Tag} label="Plate Number" value={car.plat_number} />
            <DetailItem icon={CalendarDays} label="Year" value={car.year} />
            <DetailItem icon={Settings} label="Transmission" value={car.transmission} />
            <DetailItem icon={Users} label="Seat Capacity" value={`${car.seat} seats`} />
            <DetailItem icon={DollarSign} label="Price per Day" value={`Rp ${car.price.toLocaleString('id-ID')}`} />
            <DetailItem icon={ImageIcon} label="Image URL" value={isValidHttpUrl(car.picture_upload) ? <a href={car.picture_upload!} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block max-w-xs">{car.picture_upload}</a> : 'N/A'} />
            <div className="md:col-span-2 lg:col-span-3">
                 <DetailItem icon={Info} label="Description" value={car.description || 'No description provided.'} />
            </div>
          </CardContent>
           <CardFooter className="bg-muted/30 p-4 text-xs text-muted-foreground flex justify-between">
            <span>Created: {car.created_at ? new Date(car.created_at).toLocaleString() : 'N/A'}</span>
            <span>Last Updated: {car.updated_at ? new Date(car.updated_at).toLocaleString() : 'N/A'}</span>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
