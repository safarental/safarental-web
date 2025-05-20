
"use client";

import Link from 'next/link';
import type { Gallery, GalleriesResponse } from '@/types/gallery';
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
import { MoreHorizontal, Eye, Edit, Trash2, Image as ImageIconLucide } from 'lucide-react';
import Image from 'next/image';
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

interface GalleriesTableProps {
  galleriesResponse: GalleriesResponse | null;
  onDelete: (id: number) => Promise<void>;
  isDeleting: number | null; 
}

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

export function GalleriesTable({ galleriesResponse, onDelete, isDeleting }: GalleriesTableProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState<Gallery | null>(null);

  const handleDeleteClick = (gallery: Gallery) => {
    setGalleryToDelete(gallery);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (galleryToDelete) {
      await onDelete(galleryToDelete.id);
      setShowDeleteDialog(false);
      setGalleryToDelete(null);
    }
  };
  
  const galleries = galleriesResponse?.data || [];

  if (!galleriesResponse || galleries.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-10 border rounded-lg shadow-sm bg-card">
            <ImageIconLucide className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Tidak Ada Item Galeri Ditemukan</h2>
            <p className="text-muted-foreground mb-6">
                Sepertinya belum ada item di galeri.
            </p>
            <Button asChild>
                <Link href="/admin/galleries/create">
                    Tambahkan Item Galeri Pertama Anda
                </Link>
            </Button>
        </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Gambar</TableHead>
            <TableHead>Judul</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead className="text-right w-[100px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {galleries.map((gallery) => {
            const imageSrc = gallery.picture_upload ? getGalleryImageUrl(gallery.picture_upload) : `https://placehold.co/100x70.png`;
            return (
              <TableRow key={gallery.id}>
                <TableCell>
                  <Image
                    src={imageSrc}
                    alt={gallery.title}
                    width={100}
                    height={70}
                    className="rounded-md object-cover border"
                    data-ai-hint="gallery thumbnail"
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{gallery.title}</div>
                </TableCell>
                <TableCell className="max-w-xs truncate">{gallery.description || 'N/A'}</TableCell>
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
                        <Link href={`/admin/galleries/${gallery.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> Lihat
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/galleries/${gallery.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" /> Ubah
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(gallery)} disabled={isDeleting === gallery.id}>
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
            <AlertDialogTitle>Apakah Anda yakin ingin menghapus item galeri ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus item galeri secara permanen
              "{galleryToDelete?.title}" (ID: {galleryToDelete?.id}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setGalleryToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting === galleryToDelete?.id}
            >
              {isDeleting === galleryToDelete?.id ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
