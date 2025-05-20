
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MetaWebFormValues } from "@/lib/schemas/metaWebSchema";
import { metaWebSchema } from "@/lib/schemas/metaWebSchema";
import type { MetaWeb } from "@/types/metaWeb";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface MetaWebFormProps {
  onSubmit: (values: MetaWebFormValues) => Promise<void>;
  initialData?: MetaWeb | null;
  isSubmitting: boolean;
  submitButtonText?: string;
  formTitle?: string;
  formDescription?: string;
}

export function MetaWebForm({
  onSubmit,
  initialData,
  isSubmitting,
  submitButtonText = "Simpan Pengaturan",
  formTitle = "Pengaturan Website",
  formDescription = "Kelola informasi umum dan metadata website Anda."
}: MetaWebFormProps) {
  const form = useForm<MetaWebFormValues>({
    resolver: zodResolver(metaWebSchema),
    defaultValues: initialData
      ? {
          website_name: initialData.website_name || "",
          description: initialData.description || "",
          vision: initialData.vision || "",
          mission: initialData.mission || "",
          email: initialData.email || "",
          phone: initialData.phone || "",
          address: initialData.address || "",
          whatsapp: initialData.whatsapp || "",
          instagram: initialData.instagram || "",
          facebook: initialData.facebook || "",
        }
      : {
          website_name: "",
          description: "",
          vision: "",
          mission: "",
          email: "",
          phone: "",
          address: "",
          whatsapp: "",
          instagram: "",
          facebook: "",
        },
  });

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
              name="website_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Website</FormLabel>
                  <FormControl>
                    <Input placeholder="Website Keren Anda" {...field} />
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
                    <Textarea placeholder="Deskripsi singkat website Anda." {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visi (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Visi perusahaan Anda." {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Misi (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Misi perusahaan Anda." {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Opsional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="kontak@contoh.com" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+621234567890" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Jl. Utama No. 123, Kota, Negara" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <h3 className="text-lg font-medium pt-4 border-t">Media Sosial (Opsional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="cth., 628123456789" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pengguna Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="instagram_anda" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Profil Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="https://facebook.com/halamananda" {...field} value={field.value ?? ""} />
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
