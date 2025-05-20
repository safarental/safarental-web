
export interface Testimoni {
  id: number;
  user_name: string;
  rating: number; // Assuming 1-5
  comment: string;
  // Assuming picture_upload field from API for avatar, consistent with Mobil & Gallery
  // Path relative to public/storage, e.g., "testimoni_avatars/filename.jpg"
  picture_upload?: string | null; 
  created_at?: string;
  updated_at?: string;
}
