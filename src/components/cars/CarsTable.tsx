
"use client";

import Link from 'next/link';
import { Mobil, PaginatedCarsResponse } from '@/types/mobil';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash2, Car } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';
import { API_BASE_URL } from '@/config';

interface CarsTableProps {
  carsResponse: PaginatedCarsResponse | null;
  onDelete: (id: number) => Promise<void>;
  isDeleting: number | null; 
}

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
  
  // Mobil picture_upload paths are like 'storage/mobil_pictures/file.jpg'
  // It already includes 'storage/' so no need to add it again.
  return `${cleanAppBaseUrl}/${cleanRelativePath}`;
};

export function CarsTable({ carsResponse, onDelete, isDeleting }: CarsTableProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Mobil | null>(null);

  const handleDeleteClick = (car: Mobil) => {
    setCarToDelete(car);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (carToDelete) {
      await onDelete(carToDelete.id);
      setShowDeleteDialog(false);
      setCarToDelete(null);
    }
  };
  
  const cars = carsResponse?.data.data || [];

  if (!carsResponse || cars.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-10 border rounded-lg shadow-sm bg-card">
            <Car className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Tidak Ada Mobil Ditemukan</h2>
            <p className="text-muted-foreground mb-6">
                Sepertinya belum ada mobil di sistem.
            </p>
            <Button asChild>
                <Link href="/admin/cars/create">
                    Tambahkan Mobil Pertama Anda
                </Link>
            </Button>
        </div>
    );
  }
  
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


  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Gambar</TableHead>
            <TableHead>Merek & Model</TableHead>
            <TableHead>No. Polisi</TableHead>
            <TableHead>Tahun</TableHead>
            <TableHead>Transmisi</TableHead>
            <TableHead>Kursi</TableHead>
            <TableHead>Harga/Hari</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right w-[100px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => {
            const imageSrc = getFullImageUrl(car.picture_upload) || `https://placehold.co/100x70.png`;
            return (
              <TableRow key={car.id}>
                <TableCell>
                  <Image
                    src={imageSrc}
                    alt={`${car.merk} ${car.model}`}
                    width={80}
                    height={56}
                    className="rounded-md object-cover border"
                    data-ai-hint="car image"
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{car.merk}</div>
                  <div className="text-sm text-muted-foreground">{car.model}</div>
                </TableCell>
                <TableCell>{car.plat_number || 'N/A'}</TableCell>
                <TableCell>{car.year}</TableCell>
                <TableCell>{car.transmission}</TableCell>
                <TableCell>{car.seat}</TableCell>
                <TableCell>Rp {car.price.toLocaleString('id-ID')}</TableCell>
                <TableCell>
                   <Badge variant={getStatusVariant(car.status)}>{car.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/cars/${car.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> Lihat
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/cars/${car.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" /> Ubah
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(car)} disabled={isDeleting === car.id}>
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin ingin menghapus mobil ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus mobil secara permanen
              "{carToDelete?.merk} {carToDelete?.model}" (ID: {carToDelete?.id}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCarToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting === carToDelete?.id}
            >
              {isDeleting === carToDelete?.id ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
