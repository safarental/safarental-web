
export interface Testimoni {
  id: number;
  name: string; // Diubah dari user_name
  rate: number; // Diubah dari rating
  feedback: string; // Diubah dari comment
  // picture_upload tidak ada di contoh API untuk testimoni, jika ada bisa ditambahkan lagi
  // picture_upload?: string | null; 
  created_at?: string;
  updated_at?: string;
}

