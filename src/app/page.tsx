
import type { LandingPageApiResponse } from '@/types/LandingPageData';
import { API_BASE_URL } from '@/config';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CarListSection } from '@/components/landing/CarListSection';
import { FeedbackForm } from '@/components/landing/FeedbackForm';
import { getPublicStorageUrl } from '@/lib/imageUtils';
import { Mail, MapPin, MessageCircle as MessageCircleIcon, Instagram, Star, ChevronRight, Car, Images, Users, HelpCircle, ServerCrash, CarFront, BadgePercent, Rocket, LifeBuoy, Award, HeartHandshake, GitCompareArrows, Sparkles, MessageSquare } from 'lucide-react';

async function getLandingPageData(): Promise<LandingPageApiResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/home`, { next: { revalidate: 3600 } });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gagal memuat data landing page:", response.status, errorText);
      return null;
    }
    const responseData: LandingPageApiResponse = await response.json();

    if (!responseData.meta_web) {
      responseData.meta_web = {
        website_name: "Rental Mobil Kami",
        description: "Deskripsi default jika tidak ada dari API."
      };
    } else {
      if (responseData.meta_web.website_name === null || responseData.meta_web.website_name === undefined) {
          responseData.meta_web.website_name = "Rental Mobil Kami";
      }
       if (responseData.meta_web.description === null || responseData.meta_web.description === undefined) {
          responseData.meta_web.description = "Deskripsi default jika tidak ada dari API.";
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

export default async function LandingPage() {
  const data = await getLandingPageData();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-background text-foreground">
        <ServerCrash className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold mb-4 text-destructive">Oops! Terjadi kesalahan.</h1>
        <p className="text-lg text-muted-foreground mb-6">Kami tidak dapat memuat konten halaman saat ini. Silakan coba lagi nanti atau hubungi dukungan.</p>
         <Link href="/login">
          <Button variant="outline">Masuk ke Panel Admin</Button>
        </Link>
      </div>
    );
  }

  const { meta_web, mobils, galleries, testimonis, faqs } = data;

  const renderStars = (rating: number) => {
    const totalStars = 5;
    const fullStars = Math.max(0, Math.min(totalStars, Math.round(rating)));
    return Array(totalStars).fill(0).map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < fullStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const websiteName = meta_web?.website_name || "Rental Mobil Kami";


  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-20 px-6 sm:px-10 lg:px-16 shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Selamat Datang di {websiteName}</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {meta_web?.description || "Tujuan utama Anda untuk rental mobil berkualitas. Jelajahi armada kami dan pesan kendaraan Anda hari ini!"}
          </p>
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
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
        <section id="gallery" className="py-16 px-6 sm:px-10 lg:px-16 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 text-primary flex items-center justify-center"><Images className="mr-3 h-10 w-10" /> Galeri Kami</h2>
            <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
              Intip momen-momen perjalanan tak terlupakan bersama armada kami. Dari petualangan seru hingga kenyamanan keluarga, biarkan galeri ini menginspirasi perjalanan Anda berikutnya.
            </p>
            <div className="mt-8">
              <div className="
                flex overflow-x-auto space-x-4 pb-4 
                sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 sm:space-x-0 sm:pb-0 sm:overflow-visible
              ">
                {galleries.map((item) => (
                  <div
                    key={item.id}
                    className="
                      flex-shrink-0 w-48 rounded-lg shadow-lg group relative aspect-square overflow-hidden
                      sm:w-full sm:flex-shrink"
                  >
                    <img
                      src={getPublicStorageUrl(item.picture_upload) || `https://placehold.co/400x400.png`}
                      alt={item.title || 'Gambar galeri'}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint="activity travel"
                    />
                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                      <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                      {item.description && <p className="text-sm text-gray-200">{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimoni Section */}
      {testimonis && testimonis.length > 0 && (
        <section id="testimonials" className="py-16 px-6 sm:px-10 lg:px-16">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary flex items-center justify-center"><Users className="mr-3 h-10 w-10" /> Kata Pelanggan Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonis.map((testimoni) => (
                <Card key={testimoni.id} className="shadow-lg flex flex-col items-center text-center p-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-primary bg-gray-200 flex items-center justify-center">
                    <span className="text-3xl font-semibold text-primary">
                      {testimoni.name ? testimoni.name.substring(0, 1).toUpperCase() : 'P'}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-semibold mb-1">{testimoni.name}</CardTitle>
                  {typeof testimoni.rate === 'number' && testimoni.rate > 0 && (
                    <div className="flex mb-2">
                      {renderStars(testimoni.rate)}
                    </div>
                  )}
                  <CardContent className="text-sm text-muted-foreground italic p-0">
                    "{testimoni.feedback}"
                  </CardContent>
                </Card>
              ))}
            </div>
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

      {/* Footer Section */}
      <footer className="bg-primary text-primary-foreground py-12 px-6 sm:px-10 lg:px-16">
        <div className="container mx-auto text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">{websiteName}</h3>
              <p className="text-sm opacity-80">Perjalanan berkualitas, harga tak terkalahkan.</p>
            </div>
            {meta_web && (
              <div className="md:col-span-2">
                <h4 className="text-lg font-semibold mb-4">Hubungi Kami</h4>
                <div className="space-y-3">
                  {meta_web.address && (
                    <p className="flex items-center justify-center md:justify-start text-sm">
                      <MapPin className="mr-2 h-5 w-5" /> {meta_web.address}
                    </p>
                  )}
                  {meta_web.email && (
                    <p className="flex items-center justify-center md:justify-start text-sm">
                      <Mail className="mr-2 h-5 w-5" /> <a href={`mailto:${meta_web.email}`} className="hover:underline">{meta_web.email}</a>
                    </p>
                  )}
                  {meta_web.whatsapp && (
                    <p className="flex items-center justify-center md:justify-start text-sm">
                      <MessageCircleIcon className="mr-2 h-5 w-5" /> <a href={`https://wa.me/${meta_web.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{meta_web.whatsapp}</a>
                    </p>
                  )}
                  {meta_web.instagram && (
                     <p className="flex items-center justify-center md:justify-start text-sm">
                      <Instagram className="mr-2 h-5 w-5" /> <a href={meta_web.instagram.startsWith('http') ? meta_web.instagram : `https://instagram.com/${meta_web.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">@{meta_web.instagram.replace('@','')}</a>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-sm text-center opacity-80">
            &copy; {new Date().getFullYear()} {websiteName}. Hak cipta dilindungi.
            <p className="mt-1">Ditenagai oleh Firebase Studio</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
