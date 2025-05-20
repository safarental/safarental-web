
import type { LandingPageApiResponse } from '@/types/LandingPageData';
import { API_BASE_URL } from '@/config';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CarListSection } from '@/components/landing/CarListSection';
import { FeedbackForm } from '@/components/landing/FeedbackForm';
import { GallerySection } from '@/components/landing/GallerySection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { ChevronRight, Car as CarIconLucide, Images, Users, HelpCircle, ServerCrash, CarFront, BadgePercent, Rocket, LifeBuoy, Award, HeartHandshake, GitCompareArrows, Sparkles } from 'lucide-react';
import PublicPageLayout from '@/components/layout/PublicPageLayout';
import { getPublicStorageUrl } from '@/lib/imageUtils'; // Pastikan ini diimpor jika digunakan di sini (mis. untuk gambar galeri langsung)

async function getLandingPageData(): Promise<LandingPageApiResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/home`, { cache: 'no-store' }); 
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gagal memuat data landing page:", response.status, errorText);
      return null;
    }
    const responseData: LandingPageApiResponse = await response.json();

    if (!responseData.meta_web) {
      responseData.meta_web = {
        website_name: "Safarental", // Diubah
        description: "Solusi rental mobil terbaik dengan armada premium dan layanan prima.",
        whatsapp: null,
        instagram: null,
        address: null,
        email: null
      };
    } else {
       if (!responseData.meta_web.website_name) {
          responseData.meta_web.website_name = "Safarental"; // Diubah
      }
       if (!responseData.meta_web.description) {
          responseData.meta_web.description = "Solusi rental mobil terbaik dengan armada premium dan layanan prima.";
      }
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
  const websiteName = meta_web?.website_name || "Safarental"; // Diubah fallback

  return (
    <PublicPageLayout>
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-28 md:py-32 px-6 sm:px-10 lg:px-16 shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight !leading-tight">
            Kendaraan Impian, Perjalanan Tak Terlupakan Bersama <span className="text-accent">{websiteName}</span>!
          </h1>
          <p className="text-lg sm:text-xl mb-10 max-w-3xl mx-auto text-primary-foreground/90">
            Jelajahi armada premium kami, nikmati harga terbaik, dan layanan pelanggan yang siap membuat setiap perjalanan Anda istimewa. Booking mudah, pengalaman tak terlupakan!
          </p>
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-lg">
            <Link href="#cars">Lihat Pilihan Mobil <ChevronRight className="ml-2 h-5 w-5" /></Link>
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
              <Card key={index} className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
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
              <Card key={index} className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
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
