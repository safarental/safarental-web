
"use client";

import type { Gallery } from '@/types/gallery';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPublicStorageUrl } from '@/lib/imageUtils';
import { cn } from '@/lib/utils';

interface GallerySectionProps {
  galleries: Gallery[];
}

export function GallerySection({ galleries }: GallerySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth -1); // -1 for precision
    }
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScrollability);
    window.addEventListener('resize', checkScrollability); // Re-check on resize

    return () => {
      container?.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [galleries]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // Scroll by roughly 75% of the visible width, or by one item width
      const itemWidth = 240; // Corresponds to w-60 (240px)
      const scrollAmount = Math.min(scrollContainerRef.current.clientWidth * 0.75, itemWidth);
      
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!galleries || galleries.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="py-16 px-6 sm:px-10 lg:px-16 bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-primary flex items-center justify-center">
          <Images className="mr-3 h-10 w-10" /> Galeri Kami
        </h2>
        <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          Intip momen-momen perjalanan tak terlupakan bersama armada kami. Dari petualangan seru hingga kenyamanan keluarga, biarkan galeri ini menginspirasi perjalanan Anda berikutnya.
        </p>
        
        <div className="relative group/gallery-nav">
          <div
            ref={scrollContainerRef}
            className="
              flex overflow-x-auto space-x-4 pb-4 
              sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 sm:space-x-0 sm:pb-0 sm:overflow-visible
              scrollbar-hide 
            "
          >
            {galleries.map((item) => (
              <div
                key={item.id}
                className="
                  flex-shrink-0 w-60 h-60 rounded-lg shadow-lg group/item relative overflow-hidden 
                  sm:w-full sm:h-auto sm:aspect-[4/3] 
                "
              >
                <Image
                  src={getPublicStorageUrl(item.picture_upload) || `https://placehold.co/400x300.png`}
                  alt={item.title || 'Gambar galeri'}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover/item:scale-105"
                  data-ai-hint="activity travel"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  {item.description && <p className="text-sm text-gray-200 line-clamp-3">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Arrow buttons for mobile/scrollable view, hidden on sm+ and if not scrollable */}
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background",
                "sm:hidden group-hover/gallery-nav:opacity-100 md:opacity-0 transition-opacity" 
              )}
              onClick={() => scroll('left')}
              aria-label="Gulir ke kiri"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background",
                "sm:hidden group-hover/gallery-nav:opacity-100 md:opacity-0 transition-opacity"
              )}
              onClick={() => scroll('right')}
              aria-label="Gulir ke kanan"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

// Untuk scrollbar-hide, tambahkan ini ke src/app/globals.css jika belum ada:
/*
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;  
  scrollbar-width: none;    
}
*/
    