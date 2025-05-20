
export const CAR_CATEGORIES = ['MPV', 'SUV', 'HATCHBACK', 'CROSSOVER', 'SEDAN', 'COUPE', 'CABRIOLET', 'ROADSTER'] as const;
export const TRANSMISSION_TYPES = ['AT', 'MT'] as const;
export const CAR_STATUSES = ['Available', 'Disewa', 'Out Of Order'] as const;

export type CarCategory = typeof CAR_CATEGORIES[number];
export type TransmissionType = typeof TRANSMISSION_TYPES[number];
export type CarStatus = typeof CAR_STATUSES[number];

export interface Mobil {
  id: number;
  plat_number?: string | null;
  category: CarCategory;
  merk: string;
  model: string;
  year: number;
  transmission: TransmissionType;
  seat: number;
  description?: string | null;
  status: CarStatus;
  price: string; // Diubah menjadi string untuk mengakomodasi respons API landing page
  picture_upload?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedCarsResponse {
  message: string;
  data: {
    current_page: number;
    data: Mobil[]; // Mobil di sini akan memiliki price sebagai string jika digunakan untuk list API yang mengembalikan string
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface MobilDetailResponse {
    message: string;
    data: Mobil; // Mobil di sini akan memiliki price sebagai string
}

