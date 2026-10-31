export const locales = ['en', 'de', 'hi', 'ar'] as const
export type Locale = (typeof locales)[number]
export const hasLocale = (x: string): x is Locale => (locales as readonly string[]).includes(x)
export const dirOf = (lng: Locale) => (lng === 'ar' ? 'rtl' : 'ltr')
