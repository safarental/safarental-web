
"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mobil, PublicListMobilResponse, TRANSMISSION_TYPES } from '@/types/mobil';
import type { MetaWebLanding } from '@/types/LandingPageData';
import { API_BASE_URL } from '@/config';
import { getPublicStorageUrl } from '@/lib/imageUtils';
import { Car as CarIcon, Eye, MessageCircle, CalendarDays, Settings, Users, DollarSign, Info, Palette, Filter, Search, Loader2, AlertTriangle, ChevronLeft, ChevronRight, ListCollapse } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

const ITEMS_PER_PAGE = 6; 
const ALL_TRANSMISSIONS_VALUE = "__ALL_TRANSMISSIONS__";

interface Filters {
  merk: string;
  model: string;
  transmission: string;
  seat: string; 
  price: string; 
}

const formatPriceForDisplay = (priceString: string | number): string => {
    const priceNumber = typeof priceString === 'string' ? parseFloat(priceString) : priceString;
    if (isNaN(priceNumber)) return 'N/A';
    return priceNumber.toLocaleString('id-ID');
};

export default function CarListPageClient({ metaWeb }: { metaWeb: MetaWebLanding | null }) {
  const [cars, setCars] = useState<Mobil[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    merk: '',
    model: '',
    transmission: '',
    seat: '',
    price: '2000000', 
  });
  const [maxPriceRange, setMaxPriceRange] = useState(5000000); 
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [selectedCar, setSelectedCar] = useState<Mobil | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const fetchCars = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const queryParams = new URLSearchParams();
    if (filters.merk) queryParams.append('merk', filters.merk);
    if (filters.model) queryParams.append('model', filters.model);
    if (filters.transmission) queryParams.append('transmission', filters.transmission);
    if (filters.seat && parseInt(filters.seat) > 0) queryParams.append('seat', filters.seat);
    if (filters.price && parseFloat(filters.price) > 0) queryParams.append('price', filters.price);

    try {
      const response = await fetch(`${API_BASE_URL}/list-mobil?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memuat data mobil.');
      }
      const data: PublicListMobilResponse = await response.json();
      setCars(data.mobils || []);
      setCurrentPage(1); 
    } catch (err: any) {
      setError(err.message);
      setCars([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: keyof Filters, value: string) => {
    if (name === 'transmission') {
      setFilters(prev => ({ ...prev, transmission: value === ALL_TRANSMISSIONS_VALUE ? '' : value }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePriceSliderChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, price: String(value[0]) }));
  };

  const handleFilterSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    fetchCars();
    if (isMobileFilterOpen) setIsMobileFilterOpen(false);
  };
  
  const handleClearFilters = () => {
    setFilters({ merk: '', model: '', transmission: '', seat: '', price: String(maxPriceRange) });
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = cars.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cars.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleOpenModal = (mobil: Mobil) => {
    setSelectedCar(mobil);
    setIsModalOpen(true);
  };

  const generateWhatsAppMessage = (mobil: Mobil) => {
    const websiteName = metaWeb?.website_name || "Safarental";
    const message = `Halo ${websiteName}, saya tertarik untuk menyewa mobil ${mobil.merk} ${mobil.model}. Bisa berikan info lebih lanjut?`;
    return encodeURIComponent(message);
  };

  const cleanWhatsAppNumber = (number: string | null | undefined) => {
    if (!number) return null;
    return number.replace(/\D/g, '');
  };
  const whatsappNumber = metaWeb?.whatsapp ? cleanWhatsAppNumber(metaWeb.whatsapp) : null;

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <CarIcon className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-primary tracking-tight">Temukan Mobil Impian Anda</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Jelajahi beragam pilihan mobil kami. Gunakan filter untuk menemukan yang paling sesuai dengan kebutuhan perjalanan Anda.
        </p>
      </div>

      <div className="mb-8 p-6 bg-card rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-primary flex items-center">
            <Filter className="mr-2 h-6 w-6" /> Saring Pencarian
          </h2>
          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <ListCollapse className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>

        {isMobileFilterOpen && (
            <Dialog open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Filter Mobil</DialogTitle>
                        <DialogDescription>Sesuaikan kriteria pencarian Anda.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleFilterSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="merk-mobile">Merek</Label>
                          <Input id="merk-mobile" name="merk" value={filters.merk} onChange={handleFilterChange} placeholder="cth., Toyota" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="model-mobile">Model</Label>
                          <Input id="model-mobile" name="model" value={filters.model} onChange={handleFilterChange} placeholder="cth., Avanza" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="transmission-mobile">Transmisi</Label>
                          <Select 
                            name="transmission" 
                            value={filters.transmission === '' ? ALL_TRANSMISSIONS_VALUE : filters.transmission} 
                            onValueChange={(value) => handleSelectChange('transmission', value)}
                          >
                            <SelectTrigger id="transmission-mobile"><SelectValue placeholder="Pilih Transmisi" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value={ALL_TRANSMISSIONS_VALUE}>Semua</SelectItem>
                              {TRANSMISSION_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="seat-mobile">Jumlah Kursi</Label>
                          <Input id="seat-mobile" name="seat" type="number" value={filters.seat} onChange={handleFilterChange} placeholder="cth., 5" min="1"/>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price-mobile">Harga Maksimal per Hari (Rp {formatPriceForDisplay(filters.price)})</Label>
                          <Slider
                            id="price-mobile"
                            name="price"
                            min={50000} max={maxPriceRange} step={50000}
                            value={[parseFloat(filters.price)]}
                            onValueChange={(value) => handlePriceSliderChange(value)}
                            className="my-4"
                          />
                        </div>
                         <DialogFooter className="sm:justify-start">
                             <Button type="submit" className="w-full sm:w-auto">
                                <Search className="mr-2 h-4 w-4" /> Terapkan Filter
                            </Button>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost" className="w-full sm:w-auto">Batal</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        )}
        
        <form onSubmit={handleFilterSubmit} className={`space-y-6 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 md:gap-6 ${isMobileFilterOpen ? 'hidden' : 'block'} md:block`}>
          <div className="space-y-1">
            <Label htmlFor="merk">Merek</Label>
            <Input id="merk" name="merk" value={filters.merk} onChange={handleFilterChange} placeholder="cth., Toyota" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="model">Model</Label>
            <Input id="model" name="model" value={filters.model} onChange={handleFilterChange} placeholder="cth., Avanza" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="transmission">Transmisi</Label>
            <Select 
              name="transmission" 
              value={filters.transmission === '' ? ALL_TRANSMISSIONS_VALUE : filters.transmission} 
              onValueChange={(value) => handleSelectChange('transmission', value)}
            >
              <SelectTrigger id="transmission"><SelectValue placeholder="Pilih Transmisi" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_TRANSMISSIONS_VALUE}>Semua</SelectItem>
                {TRANSMISSION_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="seat">Jumlah Kursi</Label>
            <Input id="seat" name="seat" type="number" value={filters.seat} onChange={handleFilterChange} placeholder="cth., 5" min="1"/>
          </div>
          <div className="space-y-1 xl:col-span-2">
            <Label htmlFor="price">Harga Maksimal per Hari (Rp {formatPriceForDisplay(filters.price)})</Label>
            <Slider
              id="price" name="price"
              min={50000} max={maxPriceRange} step={50000}
              value={[parseFloat(filters.price)]}
              onValueChange={handlePriceSliderChange}
              className="my-4"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 xl:col-span-6 xl:justify-end pt-2">
            <Button type="button" variant="outline" onClick={handleClearFilters} className="w-full sm:w-auto">
              Hapus Filter
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" /> Cari Mobil
            </Button>
          </div>
        </form>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-3 text-lg">Memuat mobil...</p>
        </div>
      )}
      {error && !isLoading && (
        <div className="text-center py-10">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <p className="text-xl text-destructive">{error}</p>
          <Button onClick={fetchCars} className="mt-4">Coba Lagi</Button>
        </div>
      )}
      {!isLoading && !error && cars.length === 0 && (
        <div className="text-center py-10">
          <CarIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">Tidak ada mobil ditemukan dengan kriteria ini.</p>
          <p className="text-sm text-muted-foreground">Coba ubah filter Anda atau hapus beberapa filter.</p>
        </div>
      )}
      {!isLoading && !error && cars.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {currentItems.map((mobil) => (
              <Card key={mobil.id} className="flex flex-col md:flex-row overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-full md:w-2/5 h-56 md:h-auto relative flex-shrink-0 bg-muted/50">
                  <Image
                    src={getPublicStorageUrl(mobil.picture_upload) || `https://placehold.co/600x400.png`}
                    alt={`${mobil.merk} ${mobil.model}`}
                    layout="fill"
                    objectFit="contain"
                    className="p-2 md:p-3"
                    data-ai-hint={`${mobil.category} car`}
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

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} variant="outline" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  onClick={() => paginate(page)}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="icon"
                  className="h-9 w-9"
                >
                  {page}
                </Button>
              ))}
              <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} variant="outline" size="icon">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </>
      )}

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
                    className="p-2"
                    data-ai-hint={`${selectedCar.category} detail`}
                  />
                </div>
                <div className="md:w-3/5 flex flex-col">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm mb-4">
                    <div className="flex items-start"><Palette className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" /><div><span className="font-semibold text-foreground">Kategori:</span><p className="text-muted-foreground">{selectedCar.category}</p></div></div>
                    <div className="flex items-start"><CalendarDays className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" /><div><span className="font-semibold text-foreground">Tahun:</span><p className="text-muted-foreground">{selectedCar.year}</p></div></div>
                    <div className="flex items-start"><Settings className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" /><div><span className="font-semibold text-foreground">Transmisi:</span><p className="text-muted-foreground">{selectedCar.transmission}</p></div></div>
                    <div className="flex items-start"><Users className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" /><div><span className="font-semibold text-foreground">Kapasitas:</span><p className="text-muted-foreground">{selectedCar.seat} kursi</p></div></div>
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
              <DialogClose asChild><Button type="button" variant="outline" className="w-full sm:w-auto">Tutup</Button></DialogClose>
              {whatsappNumber ? (
                 <Button asChild className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto">
                    <Link href={`https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage(selectedCar)}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-2 h-4 w-4" /> Pesan via WhatsApp
                    </Link>
                 </Button>
              ) : (
                <Button disabled className="w-full sm:w-auto"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Tidak Tersedia</Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

    