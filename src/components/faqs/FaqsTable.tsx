
"use client";

import Link from 'next/link';
import type { Faq, FaqsResponse } from '@/types/faq';
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
import { MoreHorizontal, Eye, Edit, Trash2, HelpCircle } from 'lucide-react';
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

interface FaqsTableProps {
  faqsResponse: FaqsResponse | null;
  onDelete: (id: number) => Promise<void>;
  isDeleting: number | null; 
}

export function FaqsTable({ faqsResponse, onDelete, isDeleting }: FaqsTableProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null);

  const handleDeleteClick = (faq: Faq) => {
    setFaqToDelete(faq);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (faqToDelete) {
      await onDelete(faqToDelete.id);
      setShowDeleteDialog(false);
      setFaqToDelete(null);
    }
  };
  
  const faqs = faqsResponse?.data || [];

  if (!faqsResponse || faqs.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-10 border rounded-lg shadow-sm bg-card">
            <HelpCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Tidak Ada FAQ Ditemukan</h2>
            <p className="text-muted-foreground mb-6">
                Sepertinya belum ada FAQ di sistem.
            </p>
            <Button asChild>
                <Link href="/admin/faqs/create">
                    Tambahkan FAQ Pertama Anda
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
            <TableHead>Pertanyaan</TableHead>
            <TableHead>Jawaban</TableHead>
            <TableHead className="text-right w-[100px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="font-medium max-w-md truncate">{faq.questions}</TableCell>
                <TableCell className="max-w-lg truncate">{faq.answer}</TableCell>
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
                        <Link href={`/admin/faqs/${faq.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> Lihat
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/faqs/${faq.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" /> Ubah
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(faq)} disabled={isDeleting === faq.id}>
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin ingin menghapus FAQ ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus FAQ secara permanen: "{faqToDelete?.questions.substring(0, 50)}...".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFaqToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting === faqToDelete?.id}
            >
              {isDeleting === faqToDelete?.id ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
