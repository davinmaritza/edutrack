import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://fokuspad.my.id'
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/fitur', '/bantuan', '/cara-kerja', '/docs'],
      disallow: ['/api/', '/dashboard/', '/admin/', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
