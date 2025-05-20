
export interface MetaWeb {
  id?: number; // Optional, as it might not be present on initial creation
  website_name: string;
  description?: string | null;
  vision?: string | null;
  mission?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MetaWebResponse {
  message: string;
  data: MetaWeb;
}
