
import PublicPageLayout from '@/components/layout/PublicPageLayout';
import type { MetaWeb } from '@/types/metaWeb';
import { API_BASE_URL } from '@/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Info, Mail, MapPin, Phone, Globe, Users, Eye, Award, MessageSquare, Instagram, Facebook, ServerCrash, Smartphone } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang Kami - Profil Safarental, Penyedia Rental Mobil Terpercaya',
  description: 'Kenali lebih dekat Safarental, visi, misi, dan komitmen kami dalam menyediakan layanan sewa mobil terbaik dan terpercaya di Kalimantan.',
  keywords: ['tentang safarental', 'profil perusahaan rental mobil kalimantan', 'visi misi safarental', 'kontak safarental', 'rental mobil terpercaya kalimantan', 'safarental kalimantan'],
  alternates: {
    canonical: '/about-us',
  },
  openGraph: {
    title: 'Tentang Kami - Profil Safarental, Penyedia Rental Mobil Terpercaya',
    description: 'Kenali lebih dekat Safarental, visi, misi, dan komitmen kami dalam menyediakan layanan sewa mobil terbaik dan terpercaya di Kalimantan.',
    url: 'https://safarental.com/about-us',
    siteName: 'Safarental',
    // images: [ // Tambahkan gambar representatif jika ada
    //   {
    //     url: 'https://safarental.com/og-about.png',
    //     width: 1200,
    //     height: 630,
    //     alt: 'Tentang Safarental',
    //   },
    // ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tentang Kami - Profil Safarental, Penyedia Rental Mobil Terpercaya',
    description: 'Kenali lebih dekat Safarental, visi, misi, dan komitmen kami dalam menyediakan layanan sewa mobil terbaik dan terpercaya di Kalimantan.',
    // images: ['https://safarental.com/twitter-about.png'],
  },
};

interface AboutUsApiResponse {
  message: string;
  data: MetaWeb | null;
}

async function getAboutUsData(): Promise<MetaWeb | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/about-us`, { cache: 'no-store' });
    if (!response.ok) {
      if (response.status === 404) {
        console.warn("Data MetaWeb untuk 'Tentang Kami' tidak ditemukan (404).");
        return null;
      }
      const errorText = await response.text();
      console.error("Gagal memuat data 'Tentang Kami':", response.status, errorText);
      return null;
    }
    const result: AboutUsApiResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error saat memuat data 'Tentang Kami':", error);
    return null;
  }
}

const DetailItem = ({ icon: Icon, label, value, href }: { icon: React.ElementType, label: string, value: string | null | undefined, href?: string }) => {
  if (!value) return null;
  return (
    <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
      <Icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-md text-foreground hover:text-primary hover:underline">
            {value}
          </a>
        ) : (
          <p className="text-md text-foreground">{value}</p>
        )}
      </div>
    </div>
  );
};

export default async function AboutUsPage() {
  const metaWeb = await getAboutUsData();

  if (!metaWeb) {
    return (
      <PublicPageLayout>
        <div className="container mx-auto py-16 px-6 sm:px-10 lg:px-16 text-center">
          <ServerCrash className="w-24 h-24 text-destructive mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-destructive mb-4">Informasi Tidak Tersedia</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Mohon maaf, informasi tentang kami tidak dapat dimuat saat ini. Silakan coba lagi nanti atau hubungi administrator.
          </p>
        </div>
      </PublicPageLayout>
    );
  }
  
  const websiteName = metaWeb.website_name || "Perusahaan Kami";

  return (
    <PublicPageLayout>
      <div className="container mx-auto py-12 md:py-20 px-6 sm:px-10 lg:px-16">
        <header className="text-center mb-16">
          <Building className="mx-auto h-20 w-20 text-primary mb-6" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary tracking-tight">
            Tentang {websiteName}
          </h1>
          {metaWeb.description && (
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
              {metaWeb.description}
            </p>
          )}
        </header>

        {(metaWeb.vision || metaWeb.mission) && (
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              {metaWeb.vision && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl text-primary">
                      <Eye className="mr-3 h-7 w-7" /> Visi Kami
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground text-lg leading-relaxed">
                    <p>{metaWeb.vision}</p>
                  </CardContent>
                </Card>
              )}
              {metaWeb.mission && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl text-primary">
                      <Award className="mr-3 h-7 w-7" /> Misi Kami
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground text-lg leading-relaxed">
                    <p>{metaWeb.mission}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">Hubungi Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <DetailItem icon={MapPin} label="Alamat Kantor" value={metaWeb.address} />
            <DetailItem icon={Mail} label="Email" value={metaWeb.email} href={metaWeb.email ? `mailto:${metaWeb.email}` : undefined} />
            <DetailItem icon={Phone} label="Telepon" value={metaWeb.phone} href={metaWeb.phone ? `tel:${metaWeb.phone.replace(/\s/g, '')}` : undefined} />
            <DetailItem icon={Smartphone} label="WhatsApp" value={metaWeb.whatsapp} href={metaWeb.whatsapp ? `https://wa.me/${metaWeb.whatsapp.replace(/\D/g, '')}` : undefined} />
            {metaWeb.instagram && (
              <DetailItem 
                icon={Instagram} 
                label="Instagram" 
                value={`@${metaWeb.instagram.replace('@', '')}`} 
                href={`https://instagram.com/${metaWeb.instagram.replace('@', '')}`} 
              />
            )}
            {metaWeb.facebook && (
               <DetailItem 
                icon={Facebook} 
                label="Facebook" 
                value={metaWeb.facebook.includes('/') ? metaWeb.facebook.substring(metaWeb.facebook.lastIndexOf('/') + 1) : metaWeb.facebook}
                href={metaWeb.facebook.startsWith('http') ? metaWeb.facebook : `https://facebook.com/${metaWeb.facebook}`} 
              />
            )}
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
}
