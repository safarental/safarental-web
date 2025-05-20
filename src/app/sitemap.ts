
import type { MetadataRoute } from 'next';

const BASE_URL = 'https://safarental.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['/', '/mobil', '/about-us'];
  const currentDate = new Date().toISOString();

  // Halaman statis
  const staticPages = routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as 'weekly', // Ensure type correctness
    priority: route === '/' ? 1 : 0.8,
  }));

  // Di sini Anda bisa menambahkan logika untuk mengambil URL dinamis (misalnya, dari database)
  // Contoh:
  // const dynamicCarPages = await fetch(`${API_BASE_URL}/mobils-for-sitemap`) // Endpoint contoh
  //   .then(res => res.json())
  //   .then(data => data.mobils.map(mobil => ({
  //     url: `${BASE_URL}/mobil/${mobil.slug_or_id}`, // Sesuaikan dengan struktur URL Anda
  //     lastModified: new Date(mobil.updated_at).toISOString(),
  //     changeFrequency: 'monthly' as 'monthly',
  //     priority: 0.7,
  //   })))
  //   .catch(() => []);

  return [
    ...staticPages,
    // ...dynamicCarPages, // Aktifkan jika Anda memiliki halaman dinamis
  ];
}
