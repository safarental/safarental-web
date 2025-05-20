
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CarFormValues, carSchema } from "@/lib/schemas/carSchema";
import { CAR_CATEGORIES, TRANSMISSION_TYPES, CAR_STATUSES, Mobil } from "@/types/mobil";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { API_BASE_URL } from "@/config";

interface CarFormProps {
  onSubmit: (values: CarFormValues) => Promise<void>;
  initialData?: Mobil | null;
  isSubmitting: boolean;
  submitButtonText?: string;
  formTitle?: string;
  formDescription?: string;
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


export function CarForm({
  onSubmit,
  initialData,
  isSubmitting,
  submitButtonText = "Kirim",
  formTitle = "Detail Mobil",
  formDescription = "Isi detail untuk mobil."
}: CarFormProps) {
  const form = useForm<CarFormValues>({
    resolver: zodResolver(carSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          plat_number: initialData.plat_number || "",
          description: initialData.description || "",
          price: initialData.price ?? 0, // Zod schema expects number for form
          year: initialData.year ?? new Date().getFullYear(),
          seat: initialData.seat ?? 2,
          picture_upload: undefined, 
        }
      : {
          plat_number: "",
          category: undefined, 
          merk: "",
          model: "",
          year: new Date().getFullYear(),
          transmission: undefined, 
          seat: 2,
          description: "",
          status: 'Available',
          price: 0,
          picture_upload: undefined,
        },
  });

  const currentPictureUrl = initialData?.picture_upload ? getFullImageUrl(initialData.picture_upload) : null;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{formTitle}</CardTitle>
        <CardDescription>{formDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="plat_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Polisi (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="B 1234 XYZ" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CAR_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="merk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Merek</FormLabel>
                    <FormControl>
                      <Input placeholder="cth., Toyota, Honda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="cth., Avanza, Civic" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tahun</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="cth., 2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transmisi</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih transmisi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRANSMISSION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kapasitas Kursi</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="cth., 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga per Hari (Rp)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="cth., 500000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CAR_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                {currentPictureUrl && (
                  <div className="mb-2">
                    <FormLabel>Gambar Saat Ini</FormLabel>
                    <div className="mt-1">
                      <Image 
                        src={currentPictureUrl} 
                        alt="Gambar mobil saat ini" 
                        width={150} 
                        height={100} 
                        className="rounded-md border object-cover"
                        data-ai-hint="car current"
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
                          accept="image/jpeg,image/png,image/jpg,image/gif"
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
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Deskripsi mobil..." {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
