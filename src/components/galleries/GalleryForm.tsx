
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

// Helper function to construct the full image URL for galleries
const getGalleryImageUrl = (relativePath: string | null | undefined): string | null => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  let appBaseUrl = API_BASE_URL;
  // Strip /api or /api/ from the end of API_BASE_URL to get the app's base URL
  if (appBaseUrl.endsWith('/api')) {
    appBaseUrl = appBaseUrl.slice(0, -4);
  } else if (appBaseUrl.endsWith('/api/')) {
    appBaseUrl = appBaseUrl.slice(0, -5);
  }
  
  const cleanAppBaseUrl = appBaseUrl.endsWith('/') ? appBaseUrl.slice(0, -1) : appBaseUrl;
  // Ensure no double slashes if relativePath starts with one
  const cleanRelativePath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;

  // For galleries, the path is relative to 'storage/', e.g., 'galleries/image.jpg'
  return `${cleanAppBaseUrl}/storage/${cleanRelativePath}`;
};


export function GalleryForm({
  onSubmit,
  initialData,
  isSubmitting,
  submitButtonText = "Submit",
  formTitle = "Gallery Item Details",
  formDescription = "Fill in the details for the gallery item."
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
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Beautiful Sunset" {...field} />
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A short description of the image..." {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              {currentPictureUrl && (
                <div className="mb-2">
                  <FormLabel>Current Picture</FormLabel>
                  <div className="mt-1">
                    <Image 
                      src={currentPictureUrl} 
                      alt={initialData?.title || "Current gallery image"} 
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
                    <FormLabel>{currentPictureUrl ? "Upload New Picture (Optional)" : "Picture (Optional, max 2MB)"}</FormLabel>
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
