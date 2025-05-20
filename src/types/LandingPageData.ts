
import type { Mobil } from './mobil';
import type { Gallery } from './gallery';
import type { Faq } from './faq';
import type { Testimoni } from './testimoni';

export interface MetaWebLanding {
  website_name?: string | null;
  description?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  address?: string | null;
  email?: string | null;
  // Visi dan Misi tidak ada di endpoint /home, jadi tidak perlu di sini
  // vision?: string | null; 
  // mission?: string | null;
}

export interface LandingPageData {
  meta_web: MetaWebLanding | null;
  mobils: Mobil[];
  galleries: Gallery[];
  testimonis: Testimoni[];
  faqs: Faq[];
}

export interface LandingPageApiResponse extends LandingPageData {}
