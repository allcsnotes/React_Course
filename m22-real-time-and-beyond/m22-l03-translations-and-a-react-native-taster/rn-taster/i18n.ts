import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import de from './locales/de.json';
import hi from './locales/hi.json';
import ar from './locales/ar.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    de: { translation: de },
    hi: { translation: hi },
    ar: { translation: ar },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
