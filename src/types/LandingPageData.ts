
import type { Mobil } from './mobil';
import type { Gallery } from './gallery';
import type { Faq } from './faq';
import type { Testimoni } from './testimoni'; // Pastikan ini diimpor

export interface MetaWebLanding {
  website_name?: string | null; // Ditambahkan dari update page.tsx
  description?: string | null; // Ditambahkan dari update page.tsx
  whatsapp?: string | null;
  instagram?: string | null;
  address?: string | null;
  email?: string | null;
}

export interface LandingPageData {
  meta_web: MetaWebLanding | null;
  mobils: Mobil[]; // Mobil di sini akan memiliki price sebagai string
  galleries: Gallery[];
  testimonis: Testimoni[];
  faqs: Faq[];
}

// This is the expected structure from the API endpoint /home
export interface LandingPageApiResponse extends LandingPageData {}
