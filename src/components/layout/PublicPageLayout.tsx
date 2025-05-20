
import type { ReactNode } from 'react';
import Link from 'next/link';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { API_BASE_URL } from '@/config';
import type { LandingPageApiResponse, MetaWebLanding } from '@/types/LandingPageData';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react'; // Menggunakan ikon yang ada
import { cn } from '@/lib/utils';

async function getGlobalMetaWeb(): Promise<MetaWebLanding | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/home`, { next: { revalidate: 3600 } }); // Revalidate every hour
    if (!response.ok) {
      console.error("Gagal memuat data meta_web global:", response.status, await response.text());
      return null;
    }
    const data: LandingPageApiResponse = await response.json();
    
    const metaWebDefaults: MetaWebLanding = {
      website_name: "Safarental",
      description: "Solusi rental mobil terbaik.",
      whatsapp: null,
      instagram: null,
      address: null,
      email: null
    };

    const meta_web_data = data.meta_web ? {
      ...metaWebDefaults,
      ...data.meta_web,
      website_name: data.meta_web.website_name || metaWebDefaults.website_name,
      description: data.meta_web.description || metaWebDefaults.description,
    } : metaWebDefaults;
    
    return meta_web_data;

  } catch (error) {
    console.error("Error memuat data meta_web global:", error);
    return {
      website_name: "Safarental",
      description: "Solusi rental mobil terbaik.",
      whatsapp: null,
      instagram: null,
      address: null,
      email: null
    };
  }
}

const cleanWhatsAppNumber = (number: string | null | undefined): string | null => {
  if (!number) return null;
  return number.replace(/\D/g, ''); // Hapus semua karakter non-digit
};

export default async function PublicPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  const metaWeb = await getGlobalMetaWeb();
  const whatsappNumber = metaWeb?.whatsapp ? cleanWhatsAppNumber(metaWeb.whatsapp) : null;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <LandingNavbar websiteName={metaWeb?.website_name} />
      <main className="flex-1">{children}</main>
      <LandingFooter meta_web={metaWeb} websiteName={metaWeb?.website_name} />

      {whatsappNumber && (
        <Link
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white",
            "rounded-full p-3 shadow-lg transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
          aria-label="Hubungi kami via WhatsApp"
        >
          <MessageSquare className="h-7 w-7" />
        </Link>
      )}
    </div>
  );
}
