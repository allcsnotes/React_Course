'use client'
import { createInstance } from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { useState, type ReactNode } from 'react'
import en from './locales/en.json'
import de from './locales/de.json'
import hi from './locales/hi.json'
import ar from './locales/ar.json'
import type { Locale } from './config'

const resources = {
  en: { translation: en },
  de: { translation: de },
  hi: { translation: hi },
  ar: { translation: ar },
}

export function I18n({ lng, children }: { lng: Locale; children: ReactNode }) {
  const [i18n] = useState(() => {
    const instance = createInstance()
    instance.use(initReactI18next).init({
      lng,
      fallbackLng: 'en',
      resources,
      interpolation: { escapeValue: false },
    })
    return instance
  })
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
