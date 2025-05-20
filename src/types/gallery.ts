
export interface Gallery {
  id: number;
  title: string;
  description?: string | null;
  picture_upload?: string | null; // Path relative to public/storage, e.g., "galleries/filename.jpg"
  created_at?: string;
  updated_at?: string;
}

export interface GalleriesResponse {
  message: string;
  data: Gallery[];
}

export interface GalleryDetailResponse {
  message: string;
  data: Gallery;
}
