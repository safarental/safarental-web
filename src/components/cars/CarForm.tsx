
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
import Image from "next/image"; // Import next/image
import { API_BASE_URL } from "@/config"; // For constructing image URL if needed

interface CarFormProps {
  onSubmit: (values: CarFormValues) => Promise<void>;
  initialData?: Mobil | null;
  isSubmitting: boolean;
  submitButtonText?: string;
  formTitle?: string;
  formDescription?: string;
}

// Helper to construct full image URL if picture_upload is a relative path
const getFullImageUrl = (relativePath: string | null | undefined): string | null => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  // Assuming API_BASE_URL is like "https://yourdomain.com/api"
  // and relativePath is like "storage/mobil_pictures/image.jpg"
  // Then the image is at "https://yourdomain.com/storage/mobil_pictures/image.jpg"
  let appBaseUrl = API_BASE_URL;
  if (API_BASE_URL.endsWith('/api')) {
    appBaseUrl = API_BASE_URL.slice(0, -4);
  } else if (API_BASE_URL.endsWith('/api/')) {
    appBaseUrl = API_BASE_URL.slice(0, -5);
  }
  return `${appBaseUrl}/${relativePath}`;
};


export function CarForm({
  onSubmit,
  initialData,
  isSubmitting,
  submitButtonText = "Submit",
  formTitle = "Car Details",
  formDescription = "Fill in the details for the car."
}: CarFormProps) {
  const form = useForm<CarFormValues>({
    resolver: zodResolver(carSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          plat_number: initialData.plat_number || "",
          description: initialData.description || "",
          price: initialData.price ?? 0,
          year: initialData.year ?? new Date().getFullYear(),
          seat: initialData.seat ?? 2,
          picture_upload: undefined, // File input is for new uploads, not pre-filled with old URL/path
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
          picture_upload: undefined, // Initialize as undefined for file input
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
                    <FormLabel>Plate Number (Optional)</FormLabel>
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
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
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
                    <FormLabel>Brand (Merk)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Toyota, Honda" {...field} />
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
                      <Input placeholder="e.g., Avanza, Civic" {...field} />
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
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2023" {...field} />
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
                    <FormLabel>Transmission</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transmission" />
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
                    <FormLabel>Seat Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5" {...field} />
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
                    <FormLabel>Price per Day (Rp)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 500000" {...field} />
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
                          <SelectValue placeholder="Select status" />
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
              <div className="md:col-span-2"> {/* Make image upload span 2 cols if needed */}
                {currentPictureUrl && (
                  <div className="mb-2">
                    <FormLabel>Current Picture</FormLabel>
                    <div className="mt-1">
                      <Image 
                        src={currentPictureUrl} 
                        alt="Current car image" 
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
                  name="picture_upload" // This will hold the FileList object
                  render={({ field: { onChange, value, ...rest } }) => ( // `value` here is what RHF tracks for this field
                    <FormItem>
                      <FormLabel>{currentPictureUrl ? "Upload New Picture (Optional)" : "Picture (Optional, max 2MB)"}</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/gif"
                          onChange={(e) => {
                            onChange(e.target.files); // Pass FileList to RHF
                          }}
                          {...rest} // Pass name, ref, onBlur from RHF
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Car description..." {...field} value={field.value ?? ""} />
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
