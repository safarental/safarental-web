
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { FaqForm } from '@/components/faqs/FaqForm';
import type { FaqFormValues } from '@/lib/schemas/faqSchema';
import { API_BASE_URL } from '@/config';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CreateFaqPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchWithAuth } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (values: FaqFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/faqs`, {
        method: 'POST',
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
           const errorMessages = Object.values(data.errors).flat().join(' ');
           throw new Error(errorMessages || 'Validation failed');
        }
        throw new Error(data.message || 'Failed to create FAQ.');
      }

      toast({
        title: 'Success!',
        description: 'FAQ created successfully.',
      });
      router.push('/admin/faqs');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      console.error("Create FAQ error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Create New FAQ</h1>
            <Button variant="outline" asChild>
                <Link href="/admin/faqs">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to FAQ List
                </Link>
            </Button>
        </div>
        <FaqForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitButtonText="Create FAQ"
          formTitle="Add a New FAQ"
          formDescription="Please provide the question and its answer."
        />
      </div>
    </AppLayout>
  );
}
