
import PublicPageLayout from '@/components/layout/PublicPageLayout';
import CarListPageClient from './CarListPageClient';
import type { MetaWebLanding, LandingPageApiResponse } from '@/types/LandingPageData';
import { API_BASE_URL } from '@/config';
import { ServerCrash } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';

async function getMetaWebForCarList(): Promise<MetaWebLanding | null> {
  try {
    // Mengambil dari endpoint /home karena API /list-mobil tidak menyertakan meta_web
    const response = await fetch(`${API_BASE_URL}/home`, { next: { revalidate: 3600 } }); // Revalidate every hour
    if (!response.ok) {
      console.error("Gagal memuat data meta_web untuk daftar mobil:", response.status, await response.text());
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

    return data.meta_web ? {
      ...metaWebDefaults,
      ...data.meta_web,
      website_name: data.meta_web.website_name || metaWebDefaults.website_name,
    } : metaWebDefaults;

  } catch (error) {
    console.error("Error memuat data meta_web untuk daftar mobil:", error);
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

export async function generateMetadata(
  props: {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const metaWeb = await getMetaWebForCarList();
  const websiteName = metaWeb?.website_name || "Safarental";
  const defaultDescription = `Jelajahi semua pilihan mobil sewa dan rental kami di Kalimantan, Banjarmasin, Palangkaraya, Balikpapan, dan Paser. Temukan MPV, SUV, Hatchback, dan lainnya dengan harga terbaik dari ${websiteName}.`;

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Daftar Mobil Sewa & Rental - Armada Lengkap Kalimantan | ${websiteName}`,
    description: defaultDescription,
    keywords: ['daftar mobil ' + websiteName.toLowerCase(), 'semua mobil ' + websiteName.toLowerCase(), 'armada rental kalimantan', 'pilihan mobil sewa kalimantan', 'rental mobil banjarmasin', 'sewa mobil palangkaraya', 'rental mobil balikpapan', 'sewa mobil paser', websiteName.toLowerCase()],
    alternates: {
      canonical: '/mobil',
    },
    openGraph: {
      title: `Daftar Mobil Sewa & Rental - Armada Lengkap Kalimantan | ${websiteName}`,
      description: defaultDescription,
      url: 'https://safarental.com/mobil',
      siteName: websiteName,
      // images: [
      //   {
      //     url: 'https://safarental.com/og-mobil.png',
      //     width: 1200,
      //     height: 630,
      //     alt: `Armada Lengkap ${websiteName}`,
      //   },
      //   ...previousImages,
      // ],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Daftar Mobil Sewa & Rental - Armada Lengkap Kalimantan | ${websiteName}`,
      description: defaultDescription,
      // images: ['https://safarental.com/twitter-mobil.png'],
    },
  };
}


export default async function MobilListPage() {
  const metaWeb = await getMetaWebForCarList();

  if (!metaWeb) {
    // Fallback jika metaWeb juga gagal dimuat, meskipun PublicPageLayout punya fallback sendiri
    return (
      <PublicPageLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-6">
          <ServerCrash className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-3xl font-bold mb-4 text-destructive">Oops! Terjadi kesalahan.</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Kami tidak dapat memuat konfigurasi halaman saat ini.
          </p>
        </div>
      </PublicPageLayout>
    );
  }

  return (
    <PublicPageLayout>
      <CarListPageClient metaWeb={metaWeb} />
    </PublicPageLayout>
  );
}
