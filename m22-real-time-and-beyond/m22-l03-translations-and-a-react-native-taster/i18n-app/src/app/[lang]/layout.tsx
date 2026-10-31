import { notFound } from 'next/navigation'
import { dirOf, hasLocale, locales } from '@/i18n/config'
import './course.css'

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  return (
    <html lang={lang} dir={dirOf(lang)}>
      <body>{children}</body>
    </html>
  )
}
