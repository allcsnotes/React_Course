'use client'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const names = { en: 'English', de: 'Deutsch', hi: 'हिन्दी', ar: 'العربية' }

export default function CourseCard() {
  const { t, i18n } = useTranslation()
  return (
    <main className="page">
      <nav className="bar">
        <b className="logo">allcsvideos</b>
        <span className="langs">
          {Object.entries(names).map(([code, name]) => (
            <Link
              key={code}
              href={`/${code}`}
              className={code === i18n.language ? 'on' : ''}
            >
              {name}
            </Link>
          ))}
        </span>
      </nav>
      <p className="hello">{t('greeting', { name: 'Priya' })}</p>
      <h1>{t('hero')}</h1>
      <section className="card">
        <h2>{t('course')}</h2>
        <div className="chips">
          <span>{t('lessons', { count: 24 })}</span>
          <span>{t('learners', { count: 12345 })}</span>
        </div>
        <p>{t('price', { amount: 39.5 })}</p>
        <p>{t('starts', { date: new Date('2026-12-05T12:00:00Z') })}</p>
        <button>{t('enroll')}</button>
      </section>
    </main>
  )
}
