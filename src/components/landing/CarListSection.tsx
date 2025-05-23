
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // For WhatsApp link
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Car as CarIcon, Eye, MessageCircle, CalendarDays, Settings, Users, DollarSign, Info, Palette } from 'lucide-react';
import type { Mobil } from '@/types/mobil';
import type { MetaWebLanding } from '@/types/LandingPageData';
import { getPublicStorageUrl } from '@/lib/imageUtils';

interface CarListSectionProps {
  mobils: Mobil[];
  meta_web: MetaWebLanding | null;
  websiteName: string;
}

const formatPriceForDisplay = (priceString: string | number): string => {
    const priceNumber = typeof priceString === 'string' ? parseFloat(priceString) : priceString;
    if (isNaN(priceNumber)) {
        return 'N/A';
    }
    return priceNumber.toLocaleString('id-ID');
};


export function CarListSection({ mobils, meta_web, websiteName }: CarListSectionProps) {
  const [selectedCar, setSelectedCar] = useState<Mobil | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (mobil: Mobil) => {
    setSelectedCar(mobil);
    setIsModalOpen(true);
  };

  const generateWhatsAppMessage = (mobil: Mobil) => {
    const message = `Halo ${websiteName}, saya tertarik untuk menyewa mobil ${mobil.merk} ${mobil.model}. Bisa berikan info lebih lanjut?`;
    return encodeURIComponent(message);
  };

  const cleanWhatsAppNumber = (number: string | null | undefined) => {
    if (!number) return null;
    return number.replace(/\D/g, ''); 
  };
  
  const whatsappNumber = meta_web?.whatsapp ? cleanWhatsAppNumber(meta_web.whatsapp) : null;

  return (
    <section id="cars" className="py-16 px-6 sm:px-10 lg:px-16 bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-primary flex items-center justify-center">
          <CarIcon className="mr-3 h-10 w-10" /> Armada Pilihan Kami
        </h2>
        <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          Temukan kendaraan impian Anda dari koleksi terbaik kami. Setiap mobil dirawat dengan standar tertinggi untuk kenyamanan dan keamanan perjalanan Anda, apapun tujuannya.
        </p>
        {mobils && mobils.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mobils.map((mobil, index) => (
              <Card 
                key={mobil.id} 
                className="flex flex-col md:flex-row md:h-64 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-full md:w-1/3 h-56 md:h-full relative flex-shrink-0 bg-muted/50">
                  <Image
                    src={getPublicStorageUrl(mobil.picture_upload) || `https://placehold.co/600x400.png`}
                    alt={`${mobil.merk} ${mobil.model}`}
                    layout="fill"
                    objectFit="contain"
                    className="p-3"
                    data-ai-hint={`${mobil.category} car`}
                    priority={index < 2} 
                    sizes="(max-width: 767px) 90vw, (max-width: 1023px) 40vw, 30vw"
                  />
                </div>

                <div className="flex flex-col flex-1 p-4 justify-between">
                  <div>
                    <CardHeader className="p-0 mb-2">
                      <CardTitle className="text-xl font-semibold">{mobil.merk} {mobil.model}</CardTitle>
                      <CardDescription>{mobil.category} - {mobil.year}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 mb-3">
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center"><Settings className="mr-2 h-4 w-4 text-primary" /> Transmisi: {mobil.transmission}</p>
                        <p className="flex items-center"><Users className="mr-2 h-4 w-4 text-primary" /> Kursi: {mobil.seat}</p>
                      </div>
                      <p className="text-lg font-bold text-primary mt-3">Rp {formatPriceForDisplay(mobil.price)} / hari</p>
                    </CardContent>
                  </div>
                  <CardFooter className="flex flex-col sm:flex-row gap-2 p-0 mt-3">
                    <Button variant="outline" className="w-full sm:w-auto flex-1 text-sm py-2" onClick={() => handleOpenModal(mobil)}>
                      <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                    </Button>
                    {whatsappNumber ? (
                      <Button asChild className="w-full sm:w-auto flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2">
                        <Link href={`https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage(mobil)}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="mr-2 h-4 w-4" /> Pesan WhatsApp
                        </Link>
                      </Button>
                    ) : (
                      <Button className="w-full sm:w-auto flex-1 text-sm py-2" disabled>
                        <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                      </Button>
                    )}
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Armada mobil tidak tersedia saat ini.</p>
        )}
      </div>

      {selectedCar && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-lg md:max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-xl">
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="text-2xl font-bold text-primary">{selectedCar.merk} {selectedCar.model}</DialogTitle>
              <DialogDescription className="text-md text-muted-foreground">
                {selectedCar.category} - {selectedCar.year}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-6">
              <div className="md:flex md:flex-row md:gap-6">
                <div className="relative w-full md:w-2/5 h-64 md:h-72 rounded-lg overflow-hidden border bg-muted/50 mb-4 md:mb-0 flex-shrink-0">
                  <Image
                    src={getPublicStorageUrl(selectedCar.picture_upload) || `https://placehold.co/600x400.png`}
                    alt={`${selectedCar.merk} ${selectedCar.model}`}
                    layout="fill"
                    objectFit="contain"
                    className="p-3"
                    data-ai-hint={`${selectedCar.category} detail`}
                    sizes="(max-width: 767px) 90vw, 40vw"
                  />
                </div>

                <div className="md:w-3/5 flex flex-col">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm mb-4">
                    <div className="flex items-start">
                        <Palette className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                            <span className="font-semibold text-foreground">Kategori:</span>
                            <p className="text-muted-foreground">{selectedCar.category}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <CalendarDays className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                            <span className="font-semibold text-foreground">Tahun:</span>
                            <p className="text-muted-foreground">{selectedCar.year}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Settings className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                            <span className="font-semibold text-foreground">Transmisi:</span>
                            <p className="text-muted-foreground">{selectedCar.transmission}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Users className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                            <span className="font-semibold text-foreground">Kapasitas:</span>
                            <p className="text-muted-foreground">{selectedCar.seat} kursi</p>
                        </div>
                    </div>
                  </div>
                  <div className="space-y-1 mb-4">
                    <h4 className="font-semibold text-md text-foreground flex items-center"><Info className="mr-2 h-5 w-5 text-primary" /> Deskripsi</h4>
                    <p className="text-sm text-muted-foreground">{selectedCar.description || 'Tidak ada deskripsi tambahan.'}</p>
                  </div>
                  <div className="space-y-1 mt-auto md:mt-0"> 
                    <h4 className="font-semibold text-md text-foreground flex items-center"><DollarSign className="mr-2 h-5 w-5 text-primary" /> Harga Sewa</h4>
                    <p className="text-2xl font-bold text-accent">Rp {formatPriceForDisplay(selectedCar.price)} / hari</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row sm:justify-end gap-3">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  Tutup
                </Button>
              </DialogClose>
              {whatsappNumber ? (
                 <Button asChild className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto">
                    <Link href={`https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage(selectedCar)}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-2 h-4 w-4" /> Pesan via WhatsApp
                    </Link>
                 </Button>
              ) : (
                <Button disabled className="w-full sm:w-auto">
                    <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Tidak Tersedia
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
    
