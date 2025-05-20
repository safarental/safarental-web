
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // cn import is present

interface LandingNavbarProps {
  websiteName?: string | null;
}

// Navigation links for the landing page
const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/#cars', label: 'Armada' },
  { href: '/#gallery', label: 'Galeri' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/about-us', label: 'Tentang Kami' },
];

export function LandingNavbar({ websiteName }: LandingNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-background/80 backdrop-blur-md shadow-md sticky top-0 z-50 w-full">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <Building className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-primary">{websiteName || 'Nama Website'}</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn("text-foreground hover:text-primary transition-colors font-medium")}
              >
                {link.label}
              </Link>
            ))}
             <Button asChild>
                <Link href="/login">Masuk Admin</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background shadow-lg pb-4 z-40">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors py-2 font-medium text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="w-full mt-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Masuk Admin</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
