import { notFound } from 'next/navigation'
import { hasLocale } from '@/i18n/config'
import { I18n } from '@/i18n/I18n'
import CourseCard from './CourseCard'

export default async function Page({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  return (
    <I18n lng={lang}>
      <CourseCard />
    </I18n>
  )
}
