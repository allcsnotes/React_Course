export type Theme = 'light' | 'dark'

export type Lang = 'en' | 'de'

export type User = {
  name: string
  plan: 'free' | 'pro'
}

export type Course = {
  slug: string
  title: string
  teacher: string
  price: number
}
