
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import type { Gallery, GalleryDetailResponse } from '@/types/gallery';
import { API_BASE_URL } from '@/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Loader2, AlertTriangle, Info, CalendarDays, ImageIcon as ImageIconLucide } from 'lucide-react';

// Helper function to construct the full image URL for galleries
const getGalleryImageUrl = (relativePath: string | null | undefined): string | null => {
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
  const cleanRelativePath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  return `${cleanAppBaseUrl}/storage/${cleanRelativePath}`;
};

export default function ViewGalleryItemPage() {
  const [galleryItem, setGalleryItem] = useState<Gallery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchWithAuth } = useAuth();
  const params = useParams();
  const galleryItemId = params.id as string;

  const fetchGalleryItemData = useCallback(async () => {
    if (!galleryItemId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/galleries/${galleryItemId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch gallery item data.');
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

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-2">Loading gallery item details...</p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                 <h1 className="text-3xl font-bold">View Gallery Item</h1>
                 <Button variant="outline" asChild>
                    <Link href="/admin/galleries">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Gallery List
                    </Link>
                </Button>
            </div>
            <Card className="border-destructive bg-destructive/10">
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle /> Error Loading Item
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-destructive">{error}</p>
                <Button onClick={fetchGalleryItemData} className="mt-4">Retry</Button>
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
                 <h1 className="text-3xl font-bold">View Gallery Item</h1>
                 <Button variant="outline" asChild>
                    <Link href="/admin/galleries">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Gallery List
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader><CardTitle>Gallery Item Not Found</CardTitle></CardHeader>
                <CardContent><p>The gallery item you are trying to view could not be found.</p></CardContent>
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
  
  const imageUrl = getGalleryImageUrl(galleryItem.picture_upload);
  const displayImageUrl = galleryItem.picture_upload ? getGalleryImageUrl(galleryItem.picture_upload) : 'https://placehold.co/600x400.png';

  return (
    <AppLayout>
      <div className="space-y-6">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold">{galleryItem.title}</h1>
                <p className="text-muted-foreground">Details for Gallery Item ID: {galleryItem.id}</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href="/admin/galleries">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to List
                    </Link>
                </Button>
                <Button asChild>
                    <Link href={`/admin/galleries/${galleryItem.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Item
                    </Link>
                </Button>
            </div>
        </div>

        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-muted/30 p-4 sm:p-6">
             <CardTitle className="text-2xl">{galleryItem.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
            <div className="md:col-span-1 flex justify-center md:justify-start">
              {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={galleryItem.title}
                    width={300}
                    height={200}
                    className="rounded-lg object-cover border"
                    data-ai-hint="gallery display"
                />
              ) : (
                <div className="w-[300px] h-[200px] bg-muted rounded-lg border flex items-center justify-center text-muted-foreground">
                    <ImageIconLucide className="w-16 h-16" />
                </div>
              )}
            </div>
            <div className="md:col-span-2 space-y-6">
                 <DetailItem 
                    icon={ImageIconLucide} 
                    label="Image URL" 
                    value={imageUrl ? 
                        <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block max-w-xs">{imageUrl}</a> 
                        : 'N/A'} 
                />
                <DetailItem icon={Info} label="Description" value={galleryItem.description || 'No description provided.'} />
            </div>
          </CardContent>
           <CardFooter className="bg-muted/30 p-4 text-xs text-muted-foreground flex justify-between">
            <span>Created: {galleryItem.created_at ? new Date(galleryItem.created_at).toLocaleString() : 'N/A'}</span>
            <span>Last Updated: {galleryItem.updated_at ? new Date(galleryItem.updated_at).toLocaleString() : 'N/A'}</span>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
