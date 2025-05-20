
"use client";

import type { Gallery } from '@/types/gallery';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Images, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPublicStorageUrl } from '@/lib/imageUtils';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface GallerySectionProps {
  galleries: Gallery[];
}

export function GallerySection({ galleries }: GallerySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [selectedImage, setSelectedImage] = useState<Gallery | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5); // Add a small buffer
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // Add a small buffer
    }
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability);

    return () => {
      container?.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [galleries]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const itemWidth = scrollContainerRef.current.querySelector('div > div')?.clientWidth || 240; // w-60
      const scrollAmount = itemWidth * 0.8; // Scroll by 80% of one item width
      
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleOpenModal = (galleryItem: Gallery) => {
    setSelectedImage(galleryItem);
    setIsModalOpen(true);
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
            className={cn(
              "flex overflow-x-auto space-x-4 pb-4 scrollbar-hide", 
              "sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 sm:space-x-0 sm:pb-0 sm:overflow-visible"
            )}
          >
            {galleries.map((item) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenModal(item)}
                onKeyDown={(e) => e.key === 'Enter' && handleOpenModal(item)}
                className={cn(
                  "flex-shrink-0 w-60 h-60 rounded-lg shadow-lg group/item relative overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  "sm:w-full sm:h-auto sm:aspect-[4/3]"
                )}
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

          {/* Arrow buttons for mobile/scrollable view */}
          {galleries.length > 2 && ( // Only show arrows if there's something to scroll significantly
            <>
              {canScrollLeft && (
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground shadow-md",
                    "sm:hidden group-hover/gallery-nav:opacity-100 opacity-70 transition-opacity" 
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
                    "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground shadow-md",
                    "sm:hidden group-hover/gallery-nav:opacity-100 opacity-70 transition-opacity"
                  )}
                  onClick={() => scroll('right')}
                  aria-label="Gulir ke kanan"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {selectedImage && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-3xl max-w-[90vw] p-0 bg-card overflow-hidden max-h-[85vh] flex flex-col">
            <DialogHeader className="p-4 pb-2 border-b border-border">
              <DialogTitle className="text-xl text-primary">{selectedImage.title}</DialogTitle>
              {selectedImage.description && (
                <DialogDescription className="text-sm text-muted-foreground">{selectedImage.description}</DialogDescription>
              )}
               <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <XIcon className="h-5 w-5" />
                <span className="sr-only">Tutup</span>
              </DialogClose>
            </DialogHeader>
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="relative w-full h-auto min-h-[30vh] max-h-[70vh] bg-muted/50 rounded-md flex items-center justify-center">
                <Image
                  src={getPublicStorageUrl(selectedImage.picture_upload) || `https://placehold.co/1200x800.png`}
                  alt={selectedImage.title || 'Detail gambar galeri'}
                  layout="intrinsic" // Changed to intrinsic for better sizing within modal
                  width={1200} // Provide base width
                  height={800} // Provide base height
                  objectFit="contain"
                  className="rounded-md max-w-full max-h-[calc(70vh-2rem)]" // Max height relative to viewport height minus padding
                  data-ai-hint="gallery fullview"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
