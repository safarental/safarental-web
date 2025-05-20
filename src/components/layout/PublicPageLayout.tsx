
import type { ReactNode } from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { API_BASE_URL } from '@/config';
import type { LandingPageApiResponse, MetaWebLanding } from '@/types/LandingPageData';

async function getGlobalMetaWeb(): Promise<MetaWebLanding | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/home`, { cache: 'no-store' });
    if (!response.ok) {
      console.error("Gagal memuat data meta_web global:", response.status, await response.text());
      return null;
    }
    const data: LandingPageApiResponse = await response.json();
    
    const metaWebDefaults: MetaWebLanding = {
      website_name: "Safarental", // Diubah
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
      website_name: "Safarental", // Diubah
      description: "Solusi rental mobil terbaik.",
      whatsapp: null,
      instagram: null,
      address: null,
      email: null
    };
  }
}

export default async function PublicPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  const metaWeb = await getGlobalMetaWeb();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <LandingNavbar websiteName={metaWeb?.website_name} />
      <main className="flex-1">{children}</main>
      <LandingFooter meta_web={metaWeb} websiteName={metaWeb?.website_name} />
    </div>
  );
}
