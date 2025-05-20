
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { cn } from '@/lib/utils';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consentAccepted = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consentAccepted) {
        setIsVisible(true);
      }
    } catch (error) {
      // localStorage is not available (e.g., SSR or private browsing)
      // We can choose to show the banner or not in this case.
      // For simplicity, we'll show it if localStorage access fails.
      console.warn("Could not access localStorage for cookie consent:", error);
      setIsVisible(true); 
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    } catch (error) {
      console.warn("Could not set localStorage for cookie consent:", error);
    }
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6",
        "bg-card text-card-foreground border-t border-border shadow-2xl",
        "transition-transform duration-500 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cookie className="h-7 w-7 text-primary flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Situs web ini menggunakan cookie untuk memastikan Anda mendapatkan pengalaman terbaik.
            Dengan melanjutkan, Anda menyetujui penggunaan cookie kami.
          </p>
        </div>
        <Button onClick={handleAccept} size="sm" className="w-full sm:w-auto flex-shrink-0">
          Saya Mengerti
        </Button>
      </div>
    </div>
  );
}
