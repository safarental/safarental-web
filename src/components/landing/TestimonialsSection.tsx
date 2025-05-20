
"use client";

import type { Testimoni } from '@/types/testimoni';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRef, useState, useEffect, useCallback } from 'react';

interface TestimonialsSectionProps {
  testimonis: Testimoni[];
}

export function TestimonialsSection({ testimonis }: TestimonialsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5); // Allow a small tolerance
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // Allow a small tolerance
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollability(); // Initial check
      container.addEventListener('scroll', checkScrollability, { passive: true });
      window.addEventListener('resize', checkScrollability); // Re-check on resize

      // Ensure checkScrollability runs after layout is stable
      const timeoutId = setTimeout(checkScrollability, 100);

      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
        clearTimeout(timeoutId);
      };
    }
  }, [testimonis, checkScrollability]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const card = scrollContainerRef.current.querySelector('.testimonial-card') as HTMLElement;
      const scrollAmount = card ? card.offsetWidth * 0.8 : 300; // Scroll by 80% of card width or a default
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const renderStars = (rating: number) => {
    const totalStars = 5;
    const fullStars = Math.max(0, Math.min(totalStars, Math.round(rating)));
    return Array(totalStars).fill(0).map((_, i) => (
      <Star key={i} className={cn('w-5 h-5', i < fullStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')} />
    ));
  };

  if (!testimonis || testimonis.length === 0) {
    return <p className="text-center text-muted-foreground">Belum ada testimoni untuk ditampilkan.</p>;
  }

  return (
    <div className="relative group/testimonial-nav">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide -mx-2 px-2" // Added negative margin and padding to contain box shadows
      >
        {testimonis.map((testimoni) => (
          <div key={testimoni.id} className="testimonial-card flex-shrink-0 w-72 md:w-80"> {/* Fixed width for sliding effect */}
            <Card className="h-full flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-primary bg-muted/50 flex items-center justify-center">
                <span className="text-3xl font-semibold text-primary">
                  {testimoni.name ? testimoni.name.substring(0, 1).toUpperCase() : 'T'}
                </span>
              </div>
              <CardTitle className="text-lg font-semibold mb-1">{testimoni.name}</CardTitle>
              {typeof testimoni.rate === 'number' && testimoni.rate > 0 && (
                <div className="flex mb-3">
                  {renderStars(testimoni.rate)}
                </div>
              )}
              <CardContent className="text-sm text-muted-foreground italic p-0 flex-grow">
                <p>"{testimoni.feedback}"</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {testimonis.length > 1 && ( // Only show arrows if there's something to scroll
        <>
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground shadow-md opacity-70 group-hover/testimonial-nav:opacity-100 transition-opacity"
              onClick={() => scroll('left')}
              aria-label="Geser ke kiri"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground shadow-md opacity-70 group-hover/testimonial-nav:opacity-100 transition-opacity"
              onClick={() => scroll('right')}
              aria-label="Geser ke kanan"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}
