
import { API_BASE_URL } from '@/config';

export const getPublicStorageUrl = (relativePath: string | null | undefined): string | null => {
  if (!relativePath) return null;
  // If it's already an absolute URL, return it directly
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  let appBaseUrl = API_BASE_URL; // e.g., 'https://domain.com/api'

  // Remove /api suffix to get the application's base URL
  if (appBaseUrl.endsWith('/api')) {
    appBaseUrl = appBaseUrl.slice(0, -4);
  } else if (appBaseUrl.endsWith('/api/')) {
    appBaseUrl = appBaseUrl.slice(0, -5);
  }

  // Ensure no double slashes between base URL and /storage or relativePath
  const cleanAppBaseUrl = appBaseUrl.endsWith('/') ? appBaseUrl.slice(0, -1) : appBaseUrl;
  const cleanRelativePath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;

  // Mobil picture_upload paths are like 'storage/mobil_pictures/file.jpg' (includes 'storage/')
  // Gallery and Testimoni picture_upload paths are like 'galleries/file.jpg' (do NOT include 'storage/')
  if (cleanRelativePath.startsWith('storage/')) {
    // Path already includes 'storage/' segment (e.g., from Mobil model)
    return `${cleanAppBaseUrl}/${cleanRelativePath}`;
  } else {
    // Path is relative to the root of the public storage disk (e.g., from Gallery/Testimoni model)
    return `${cleanAppBaseUrl}/storage/${cleanRelativePath}`;
  }
};
