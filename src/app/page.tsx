
import type { LandingPageApiResponse } from '@/types/LandingPageData';
import { API_BASE_URL } from '@/config';
import { getPublicStorageUrl } from '@/lib/imageUtils';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, MapPin, MessageCircle as MessageCircleIcon, Instagram, Star, ChevronRight, Car, Images, Users, HelpCircle, ServerCrash } from 'lucide-react'; // Mengganti nama MessageCircle agar tidak konflik

async function getLandingPageData(): Promise<LandingPageApiResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/home`, { next: { revalidate: 3600 } }); // Revalidate every hour
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch landing page data:", response.status, errorText);
      return null;
    }
    const responseData = await response.json();
    // Pastikan price pada mobil di-parse sebagai float jika perlu kalkulasi, atau biarkan string untuk display
    if (responseData.mobils) {
      responseData.mobils = responseData.mobils.map((mobil: any) => ({
        ...mobil,
        price: String(mobil.price) // Pastikan price adalah string
      }));
    }
    return responseData;
  } catch (error) {
    console.error("Error fetching landing page data:", error);
    return null;
  }
}

export default async function LandingPage() {
  const data = await getLandingPageData();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-background text-foreground">
        <ServerCrash className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold mb-4 text-destructive">Oops! Something went wrong.</h1>
        <p className="text-lg text-muted-foreground mb-6">We couldn't load the page content right now. Please try again later or contact support.</p>
        {/* Tombol reload tidak bisa di server component, bisa ditambahkan jika ini client component */}
      </div>
    );
  }

  const { meta_web, mobils, galleries, testimonis, faqs } = data;

  const renderStars = (rating: number) => {
    const totalStars = 5;
    const fullStars = Math.max(0, Math.min(totalStars, Math.round(rating))); // Pastikan rating antara 0-5
    return Array(totalStars).fill(0).map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < fullStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ));
  };
  
  const formatPrice = (priceString: string | number): string => {
    const priceNumber = typeof priceString === 'string' ? parseFloat(priceString) : priceString;
    if (isNaN(priceNumber)) {
        return 'N/A';
    }
    return priceNumber.toLocaleString('id-ID');
  };


  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-20 px-4 shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Welcome to {meta_web?.website_name || "Our Car Rentals"}</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {meta_web?.description || "Your premier destination for quality car rentals. Explore our fleet and book your ride today!"}
          </p>
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="#cars">Explore Cars <ChevronRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </header>

      {/* Cars Section */}
      {mobils && mobils.length > 0 && (
        <section id="cars" className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary flex items-center justify-center"><Car className="mr-3 h-10 w-10" /> Our Fleet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mobils.map((mobil) => (
                <Card key={mobil.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <div className="relative w-full h-56">
                    <Image
                      src={getPublicStorageUrl(mobil.picture_upload) || `https://placehold.co/600x400.png`}
                      alt={`${mobil.merk} ${mobil.model}`}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={`${mobil.category} car`}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">{mobil.merk} {mobil.model}</CardTitle>
                    <CardDescription>{mobil.category} - {mobil.year}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-1">Transmission: {mobil.transmission}</p>
                    <p className="text-sm text-muted-foreground mb-3">Seats: {mobil.seat}</p>
                    <p className="text-lg font-bold text-primary">Rp {formatPrice(mobil.price)} / day</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {galleries && galleries.length > 0 && (
        <section id="gallery" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary flex items-center justify-center"><Images className="mr-3 h-10 w-10" /> Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {galleries.map((item) => (
                <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg shadow-lg group">
                  <Image
                    src={getPublicStorageUrl(item.picture_upload) || `https://placehold.co/400x400.png`}
                    alt={item.title || 'Gallery image'}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
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
        </section>
      )}

      {/* Testimonials Section */}
      {testimonis && testimonis.length > 0 && (
        <section id="testimonials" className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary flex items-center justify-center"><Users className="mr-3 h-10 w-10" /> What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonis.map((testimoni) => (
                <Card key={testimoni.id} className="shadow-lg flex flex-col items-center text-center p-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-primary bg-gray-200 flex items-center justify-center">
                    {/* Testimoni API tidak menyertakan picture_upload, jadi kita buat fallback avatar */}
                    <span className="text-3xl font-semibold text-primary">
                      {testimoni.name ? testimoni.name.substring(0, 1).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-semibold mb-1">{testimoni.name}</CardTitle>
                  {typeof testimoni.rate === 'number' && testimoni.rate > 0 && (
                    <div className="flex mb-2">
                      {renderStars(testimoni.rate)}
                    </div>
                  )}
                  <CardContent className="text-sm text-muted-foreground italic">
                    "{testimoni.feedback}"
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {faqs && faqs.length > 0 && (
        <section id="faq" className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary flex items-center justify-center"><HelpCircle className="mr-3 h-10 w-10" /> Frequently Asked Questions</h2>
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

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-4">
        <div className="container mx-auto text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">{meta_web?.website_name || "Adminify Rentals"}</h3>
              <p className="text-sm opacity-80">Quality rides, unbeatable prices.</p>
            </div>
            {meta_web && (
              <div className="md:col-span-2">
                <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
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
            &copy; {new Date().getFullYear()} {meta_web?.website_name || "Adminify"}. All Rights Reserved.
            <p className="mt-1">Powered by Firebase Studio</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

