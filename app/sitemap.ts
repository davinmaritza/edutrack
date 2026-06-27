import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fokuspad.my.id'

  // Daftar url statis utama
  const routes = [
    '',
    '/login',
    '/register',
    '/fitur',
    '/bantuan',
    '/cara-kerja',
    '/syarat-ketentuan',
    '/kebijakan-privasi',
  ]

  const sitemapRecords = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  return sitemapRecords
}
