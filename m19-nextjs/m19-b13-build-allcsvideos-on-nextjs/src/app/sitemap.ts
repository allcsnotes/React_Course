import type { MetadataRoute } from 'next'
import { getCourses } from '@/lib/api'
import { SITE } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getCourses()
  return [
    { url: SITE },
    { url: `${SITE}/courses` },
    ...courses.map((c) => ({ url: `${SITE}/courses/${c.slug}` })),
  ]
}
