import i18next from 'i18next'
import en from '../src/i18n/locales/en.json' with { type: 'json' }
import de from '../src/i18n/locales/de.json' with { type: 'json' }

const { enroll, ...deSmall } = de // pretend the German file forgot "enroll"
const resources = { en: { translation: en }, de: { translation: deSmall } }

const a = i18next.createInstance()
await a.init({ lng: 'de', fallbackLng: 'en', resources, saveMissing: true, missingKeyHandler: (lngs, ns, key) => console.log(`  handler: "${key}" is nowhere`) })
console.log('with fallback    :', a.t('enroll'))
console.log('key nobody wrote :', a.t('checkout'))

const b = i18next.createInstance()
await b.init({ lng: 'de', fallbackLng: false, resources })
console.log('without fallback :', b.t('enroll'))

const lost = Object.keys(en).filter((key) => !(key in deSmall))
console.log('de is missing    :', lost.join(', '))
