
import type { MetaWebLanding } from '@/types/LandingPageData';
import { Mail, MapPin, Instagram, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils'; // Added import

interface LandingFooterProps {
  meta_web: MetaWebLanding | null;
  websiteName?: string | null;
}

export function LandingFooter({ meta_web, websiteName = "Nama Website Anda" }: LandingFooterProps) {
  return (
    <footer className="bg-primary text-primary-foreground py-12 px-6 sm:px-10 lg:px-16">
      <div className="container mx-auto text-center md:text-left">
        <div className={cn(
            "grid grid-cols-1 gap-8 items-center",
            meta_web ? "md:grid-cols-3" : "md:grid-cols-1"
          )}
        >
          <div className={!meta_web ? "md:col-span-3 md:text-center" : ""}>
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
                    <MessageSquare className="mr-2 h-5 w-5" />
                    <a 
                      href={`https://wa.me/${meta_web.whatsapp.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:underline"
                    >
                      {meta_web.whatsapp}
                    </a>
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
  );
}
