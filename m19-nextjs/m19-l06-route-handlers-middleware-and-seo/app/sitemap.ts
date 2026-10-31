import type { MetadataRoute } from 'next'
import { courses } from '@/lib/courses'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'http://localhost:5196'
  return [
    { url: base, lastModified: new Date('2026-10-30') },
    ...courses.map((c) => ({
      url: `${base}/courses/${c.slug}`,
      lastModified: new Date('2026-10-30'),
    })),
  ]
}
