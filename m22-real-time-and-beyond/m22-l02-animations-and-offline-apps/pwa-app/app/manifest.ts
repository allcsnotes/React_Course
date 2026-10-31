import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'allcsvideos: my lessons',
    short_name: 'My lessons',
    start_url: '/',
    display: 'standalone',
    background_color: '#f3f5f9',
    theme_color: '#1a7cff',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
