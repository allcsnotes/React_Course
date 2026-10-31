import i18next from 'i18next'
import en from '../src/i18n/locales/en.json' with { type: 'json' }
import de from '../src/i18n/locales/de.json' with { type: 'json' }
import ar from '../src/i18n/locales/ar.json' with { type: 'json' }

await i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: en }, de: { translation: de }, ar: { translation: ar } },
})
for (const lng of ['en', 'de', 'ar']) {
  const t = i18next.getFixedT(lng)
  console.log(lng, [0, 1, 2, 3, 11, 100].map((count) => t('lessons', { count })).join(' | '))
}
