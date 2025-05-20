
import { API_BASE_URL } from '@/config';
import type { MetaWeb } from '@/types/metaWeb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building, Target, Eye, Mail, Phone, MapPin, Globe, MessageSquare, Instagram, Facebook, ServerCrash } from 'lucide-react';
import Image from 'next/image';
import PublicPageLayout from '@/components/layout/PublicPageLayout';

interface AboutUsApiResponse {
  message: string;
  data: MetaWeb | null;
}

async function getAboutUsData(): Promise<MetaWeb | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/about-us`, { cache: 'no-store' });
    if (!response.ok) {
      console.error("Gagal memuat data Tentang Kami:", response.status, await response.text());
      return null;
    }
    const result: AboutUsApiResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error memuat data Tentang Kami:", error);
    return null;
  }
}

export default async function AboutUsPage() {
  const metaWeb = await getAboutUsData();

  if (!metaWeb) {
    return (
      <PublicPageLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-6 bg-background text-foreground">
          <ServerCrash className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-3xl font-bold mb-4 text-destructive">Data Tidak Ditemukan</h1>
          <p className="text-lg text-muted-foreground">Informasi tentang kami tidak dapat dimuat saat ini.</p>
        </div>
      </PublicPageLayout>
    );
  }

  const websiteName = metaWeb.website_name || "Perusahaan Kami";

  return (
    <PublicPageLayout>
      <div className="bg-background text-foreground py-12 px-6 sm:px-10 lg:px-16">
        <div className="container mx-auto space-y-12">
          <header className="text-center mb-12">
            <Building className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-primary tracking-tight">{websiteName}</h1>
            {metaWeb.description && (
              <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                {metaWeb.description}
              </p>
            )}
          </header>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {metaWeb.vision && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-primary">
                    <Eye className="mr-3 h-7 w-7" /> Visi Kami
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{metaWeb.vision}</p>
                </CardContent>
              </Card>
            )}

            {metaWeb.mission && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-primary">
                    <Target className="mr-3 h-7 w-7" /> Misi Kami
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{metaWeb.mission}</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {(metaWeb.email || metaWeb.phone || metaWeb.address || metaWeb.whatsapp || metaWeb.instagram || metaWeb.facebook) && (
            <Card className="shadow-xl mt-12">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center text-primary">Hubungi Kami</CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  Kami senang mendengar dari Anda!
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-6">
                {metaWeb.address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Alamat</h4>
                      <p className="text-muted-foreground">{metaWeb.address}</p>
                    </div>
                  </div>
                )}
                {metaWeb.phone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Telepon</h4>
                      <p className="text-muted-foreground">{metaWeb.phone}</p>
                    </div>
                  </div>
                )}
                {metaWeb.email && (
                  <div className="flex items-start space-x-3">
                    <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <a href={`mailto:${metaWeb.email}`} className="text-primary hover:underline">{metaWeb.email}</a>
                    </div>
                  </div>
                )}
                {metaWeb.whatsapp && (
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">WhatsApp</h4>
                      <a href={`https://wa.me/${metaWeb.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {metaWeb.whatsapp}
                      </a>
                    </div>
                  </div>
                )}
                {metaWeb.instagram && (
                  <div className="flex items-start space-x-3">
                    <Instagram className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Instagram</h4>
                      <a href={metaWeb.instagram.startsWith('http') ? metaWeb.instagram : `https://instagram.com/${metaWeb.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        @{metaWeb.instagram.replace('@','')}
                      </a>
                    </div>
                  </div>
                )}
                {metaWeb.facebook && (
                  <div className="flex items-start space-x-3">
                    <Facebook className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Facebook</h4>
                      <a href={metaWeb.facebook.startsWith('http') ? metaWeb.facebook : `https://facebook.com/${metaWeb.facebook}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-xs block">
                        {metaWeb.facebook}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          <div className="mt-16 text-center">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Tim Kami" 
              width={600} 
              height={400} 
              className="mx-auto rounded-lg shadow-2xl"
              data-ai-hint="company team office" 
            />
            <p className="mt-4 text-muted-foreground text-sm">Foto representatif tim atau kantor kami.</p>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}
