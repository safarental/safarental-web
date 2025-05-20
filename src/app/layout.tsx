
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
  // Anda bisa menambahkan keywords default di sini juga jika diperlukan,
  // tapi keywords per halaman biasanya lebih efektif.
  // keywords: ['safarental', 'rental mobil', 'sewa mobil', 'kalimantan'],
  // Untuk robots.txt dinamis atau metadata, Anda bisa menggunakan file-based metadata API
  // seperti `robots.ts` atau `manifest.ts` di direktori app jika diperlukan.
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
