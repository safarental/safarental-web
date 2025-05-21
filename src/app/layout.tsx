
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import CookieConsentBanner from '@/components/layout/CookieConsentBanner';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'Safarental - Solusi Rental Mobil Anda di Kalimantan',
    template: '%s | Safarental',
  },
  description: 'Safarental menyediakan layanan sewa dan rental mobil terbaik di Kalimantan, Banjarmasin, Palangkaraya, Balikpapan, Paser dengan armada lengkap, harga bersaing, dan layanan prima.',
  icons: {
    icon: '/favicon.ico', // Updated favicon path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <AuthProvider>
          {children}
          <Toaster />
          <CookieConsentBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
