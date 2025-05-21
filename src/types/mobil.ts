
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

// Structure for paginated data in admin
export interface AdminPaginatedMobilData {
  current_page: number;
  data: Mobil[];
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
}

export interface PaginatedCarsResponse { // Used in admin
  message: string;
  data: AdminPaginatedMobilData;
}

export interface MobilDetailResponse { // Used in admin
    message: string;
    data: Mobil;
}

// Structure for paginated data from public /list-mobil
export interface PublicPaginatedMobilData {
  current_page: number;
  data: Mobil[];
  first_page_url: string;
  from: number | null; // API might return null if no items
  last_page: number;
  last_page_url: string;
  links: { url: string | null; label: string; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null; // API might return null if no items
  total: number;
}

export interface PublicListMobilResponse {
  mobils: PublicPaginatedMobilData; // Updated for server-side pagination
}
