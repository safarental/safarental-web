
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GalleryFormValues, gallerySchema } from "@/lib/schemas/gallerySchema";
import type { Gallery } from "@/types/gallery";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { API_BASE_URL } from "@/config";

interface GalleryFormProps {
  onSubmit: (values: GalleryFormValues) => Promise<void>;
  initialData?: Gallery | null;
  isSubmitting: boolean;
  submitButtonText?: string;
  formTitle?: string;
  formDescription?: string;
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


export function GalleryForm({
  onSubmit,
  initialData,
  isSubmitting,
  submitButtonText = "Kirim",
  formTitle = "Detail Item Galeri",
  formDescription = "Isi detail untuk item galeri."
}: GalleryFormProps) {
  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: initialData
      ? {
          ...initialData,
          description: initialData.description || "",
          picture_upload: undefined, 
        }
      : {
          title: "",
          description: "",
          picture_upload: undefined,
        },
  });

  const currentPictureUrl = initialData?.picture_upload ? getGalleryImageUrl(initialData.picture_upload) : null;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{formTitle}</CardTitle>
        <CardDescription>{formDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input placeholder="cth., Matahari Terbenam yang Indah" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Deskripsi singkat tentang gambar..." {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              {currentPictureUrl && (
                <div className="mb-2">
                  <FormLabel>Gambar Saat Ini</FormLabel>
                  <div className="mt-1">
                    <Image 
                      src={currentPictureUrl} 
                      alt={initialData?.title || "Gambar galeri saat ini"} 
                      width={150} 
                      height={100} 
                      className="rounded-md border object-cover"
                      data-ai-hint="gallery art"
                    />
                  </div>
                </div>
              )}
              <FormField
                control={form.control}
                name="picture_upload"
                render={({ field: { onChange, value, ...rest } }) => ( 
                  <FormItem>
                    <FormLabel>{currentPictureUrl ? "Unggah Gambar Baru (Opsional)" : "Gambar (Opsional, maks 2MB)"}</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={(e) => {
                          onChange(e.target.files); 
                        }}
                        {...rest} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
