
import type { LandingPageApiResponse, MetaWebLanding } from '@/types/LandingPageData';
import { API_BASE_URL } from '@/config';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CarListSection } from '@/components/landing/CarListSection';
import { FeedbackForm } from '@/components/landing/FeedbackForm';
import { GallerySection } from '@/components/landing/GallerySection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { ChevronRight, Car as CarIconLucide, Images, Users, HelpCircle, ServerCrash, CarFront, BadgePercent, Rocket, LifeBuoy, Award, HeartHandshake, GitCompareArrows, Sparkles, ArrowRight } from 'lucide-react';
import PublicPageLayout from '@/components/layout/PublicPageLayout';
import type { Metadata, ResolvingMetadata } from 'next';
import { getPublicStorageUrl } from '@/lib/imageUtils'; // Ensure this is imported if used directly here, though likely used in sub-components

// Fungsi untuk mengambil data dengan revalidasi
async function getLandingPageData(): Promise<LandingPageApiResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/home`, { next: { revalidate: 3600 } }); // Revalidate every hour
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gagal memuat data landing page:", response.status, errorText);
      if (response.status === 404) {
        console.warn("Endpoint /home tidak ditemukan (404). Menggunakan data default.");
      }
      return null;
    }
    const responseData: LandingPageApiResponse = await response.json();

    const metaWebDefaults: MetaWebLanding = {
      website_name: "Safarental",
      description: "Solusi rental mobil terbaik dengan armada premium dan layanan prima.",
      whatsapp: null,
      instagram: null,
      address: null,
      email: null
    };

    if (!responseData.meta_web) {
      console.warn("Data meta_web tidak ditemukan dalam respons API, menggunakan nilai default.");
      responseData.meta_web = metaWebDefaults;
    } else {
       responseData.meta_web.website_name = responseData.meta_web.website_name || metaWebDefaults.website_name;
       responseData.meta_web.description = responseData.meta_web.description || metaWebDefaults.description;
       responseData.meta_web.whatsapp = responseData.meta_web.whatsapp || metaWebDefaults.whatsapp;
       responseData.meta_web.instagram = responseData.meta_web.instagram || metaWebDefaults.instagram;
       responseData.meta_web.address = responseData.meta_web.address || metaWebDefaults.address;
       responseData.meta_web.email = responseData.meta_web.email || metaWebDefaults.email;
    }
    
    if (responseData.mobils) {
      responseData.mobils = responseData.mobils.map((mobil) => ({
        ...mobil,
        price: String(mobil.price) 
      }));
    }

    return responseData;
  } catch (error) {
    console.error("Error memuat data landing page:", error);
    return null;
  }
}

export async function generateMetadata(
  props: {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const data = await getLandingPageData();
  const websiteName = data?.meta_web?.website_name || "Safarental";
  const defaultDescription = `Sewa mobil murah, aman, dan terpercaya di Kalimantan, Banjarmasin, Palangkaraya, Balikpapan, dan Paser. Armada lengkap dan layanan prima dari ${websiteName}.`;
  const pageDescription = data?.meta_web?.description || defaultDescription;

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Sewa & Rental Mobil Terbaik di Kalimantan | ${websiteName}`,
    description: pageDescription,
    keywords: ['rental mobil kalimantan', 'sewa mobil kalimantan', 'rental mobil banjarmasin', 'sewa mobil banjarmasin', 'rental mobil palangkaraya', 'sewa mobil palangkaraya', 'rental mobil balikpapan', 'sewa mobil balikpapan', 'rental mobil paser', 'sewa mobil paser', websiteName.toLowerCase(), 'rental mobil murah', 'sewa mobil terpercaya'],
    metadataBase: new URL('https://safarental.com'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: `Sewa & Rental Mobil Terbaik di Kalimantan | ${websiteName}`,
      description: pageDescription,
      url: 'https://safarental.com',
      siteName: websiteName,
      images: [
        {
          url: 'https://safarental.com/og-image.png', 
          width: 1200,
          height: 630,
          alt: `${websiteName} - Rental Mobil Terbaik di Kalimantan`,
        },
        ...previousImages,
      ],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: { 
      card: 'summary_large_image',
      title: `Sewa & Rental Mobil Terbaik di Kalimantan | ${websiteName}`,
      description: pageDescription,
      images: ['https://safarental.com/twitter-image.png'],
    },
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CarRental",
        "name": websiteName,
        "description": pageDescription,
        "url": "https://safarental.com",
        ...(data?.meta_web?.whatsapp && {"telephone": data.meta_web.whatsapp.replace(/\D/g, '')}),
        ...(data?.meta_web?.address && {"address": {
          "@type": "PostalAddress",
          "streetAddress": data.meta_web.address,
          "addressCountry": "ID"
        }}),
        "areaServed": [
          {"@type": "Place", "name": "Kalimantan"},
          {"@type": "Place", "name": "Banjarmasin"},
          {"@type": "Place", "name": "Palangkaraya"},
          {"@type": "Place", "name": "Balikpapan"},
          {"@type": "Place", "name": "Paser"}
        ],
        "image": "https://safarental.com/og-image.png", 
        "priceRange": "Rp", 
        "hasMap": "https://maps.google.com/?q=" + encodeURIComponent(data?.meta_web?.address || websiteName) 
      })
    }
  };
}


export default async function HomePage() {
  const data = await getLandingPageData();

  if (!data) {
    return (
      <PublicPageLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-6 bg-background text-foreground">
          <ServerCrash className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-3xl font-bold mb-4 text-destructive">Oops! Terjadi kesalahan.</h1>
          <p className="text-lg text-muted-foreground mb-6">Kami tidak dapat memuat konten halaman saat ini. Silakan coba lagi nanti atau hubungi dukungan.</p>
        </div>
      </PublicPageLayout>
    );
  }

  const { meta_web, mobils, galleries, testimonis, faqs } = data;
  const websiteName = meta_web?.website_name || "Safarental"; 
  const heroDescription = meta_web?.description || "Jelajahi armada premium kami, nikmati harga terbaik, dan layanan pelanggan yang siap membuat setiap perjalanan Anda istimewa. Booking mudah, pengalaman tak terlupakan!";

  return (
    <PublicPageLayout>
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-28 md:py-36 px-6 sm:px-10 lg:px-16 shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight !leading-tight animate-in fade-in slide-in-from-top-10 duration-700">
            Kendaraan Impian, Perjalanan Tak Terlupakan Bersama <span className="text-accent">{websiteName}</span>!
          </h1>
          <p className="text-lg sm:text-xl mb-10 max-w-3xl mx-auto text-primary-foreground/90 animate-in fade-in slide-in-from-top-8 duration-700 delay-200">
            {heroDescription}
          </p>
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-4 text-xl animate-in fade-in zoom-in-90 duration-700 delay-400">
            <Link href="#cars">Jelajahi Mobil <ChevronRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </header>

      {/* Keunggulan Section */}
      <section id="excellence" className="py-16 px-6 sm:px-10 lg:px-16">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-primary">Rasakan Bedanya, Nikmati Keunggulannya!</h2>
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Kami tidak hanya menyewakan mobil, kami memberikan pengalaman berkendara terbaik dengan berbagai keunggulan yang siap menemani setiap perjalanan Anda.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: CarFront, title: "Armada Selalu Prima", description: "Mobil-mobil terbaru dengan perawatan rutin untuk kenyamanan dan keamanan maksimal." },
              { icon: BadgePercent, title: "Harga Jujur & Bersaing", description: "Tarif transparan tanpa biaya tersembunyi, penawaran terbaik untuk kualitas prima." },
              { icon: Rocket, title: "Pemesanan Super Cepat", description: "Proses booking online yang mudah, hanya dalam beberapa klik mobil siap Anda gunakan." },
              { icon: LifeBuoy, title: "Dukungan Pelanggan Responsif", description: "Tim kami siap membantu Anda 24/7, menjawab pertanyaan dan mengatasi kendala dengan sigap." },
            ].map((item, index) => (
              <Card 
                key={index} 
                className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-4">
                  <item.icon className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold mb-2">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Armada Section */}
      <CarListSection mobils={mobils || []} meta_web={meta_web} websiteName={websiteName} />
      <div className="container mx-auto text-center py-8 px-6 sm:px-10 lg:px-16">
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
          <Link href="/mobil">Jelajahi Semua Armada Kami <ArrowRight className="ml-2 h-5 w-5" /></Link>
        </Button>
      </div>


      {/* Kenapa Memilih Kami Section */}
      <section id="why-us" className="py-16 px-6 sm:px-10 lg:px-16">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-primary">Pilihan Cerdas untuk Setiap Perjalanan Anda</h2>
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Lebih dari sekadar rental mobil, kami adalah partner perjalanan tepercaya yang mengutamakan kepuasan dan kenyamanan Anda.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: "Terpercaya & Berpengalaman", description: "Bertahun-tahun melayani dengan standar tertinggi, membangun reputasi yang solid." },
              { icon: HeartHandshake, title: "Fokus pada Pelanggan", description: "Kepuasan Anda adalah prioritas kami, kami selalu mendengarkan dan berinovasi." },
              { icon: GitCompareArrows, title: "Fleksibilitas Tanpa Batas", description: "Berbagai pilihan mobil dan paket sewa yang bisa disesuaikan dengan kebutuhan Anda." },
              { icon: Sparkles, title: "Komitmen pada Kualitas", description: "Dari kebersihan mobil hingga layanan, kami tidak pernah berkompromi pada kualitas." },
            ].map((item, index) => (
              <Card 
                key={index} 
                className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-4">
                  <item.icon className="h-12 w-12 text-accent" />
                </div>
                <CardTitle className="text-xl font-semibold mb-2">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleries && galleries.length > 0 && (
        <GallerySection galleries={galleries} />
      )}

      {/* Testimoni Section */}
      {testimonis && testimonis.length > 0 && (
         <section id="testimonials" className="py-16 px-6 sm:px-10 lg:px-16">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 text-primary flex items-center justify-center">
                <Users className="mr-3 h-10 w-10" /> Kata Pelanggan Kami
            </h2>
            <p className="text-lg text-center text-muted-foreground mb-2 max-w-3xl mx-auto">
                Dengarkan apa kata mereka yang telah merasakan kualitas layanan terbaik dari kami. Kepuasan Anda adalah cerita sukses kami selanjutnya!
            </p>
            <p className="text-sm text-center text-muted-foreground mb-12">
                Total {testimonis.length} ulasan memuaskan.
            </p>
            <TestimonialsSection testimonis={testimonis} />
          </div>
        </section>
      )}

      {/* Feedback Form Section */}
      <section id="feedback" className="py-16 px-6 sm:px-10 lg:px-16 bg-muted/30">
        <div className="container mx-auto max-w-2xl">
           <FeedbackForm />
        </div>
      </section>

      {/* FAQ Section */}
      {faqs && faqs.length > 0 && (
        <section id="faq" className="py-16 px-6 sm:px-10 lg:px-16">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary flex items-center justify-center"><HelpCircle className="mr-3 h-10 w-10" /> Pertanyaan Umum</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={`item-${faq.id}`} className="border-b border-border">
                  <AccordionTrigger className="text-left hover:no-underline py-4 text-lg font-medium">
                    {faq.questions}
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
    </PublicPageLayout>
  );
}
