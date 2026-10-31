const CACHE = 'allcs-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(['/'])))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)
  if (req.method !== 'GET') return
  if (url.pathname.startsWith('/_next/static/')) event.respondWith(cacheFirst(req))
  else if (url.port === '8222' || req.mode === 'navigate') event.respondWith(networkFirst(req))
})

async function cacheFirst(req) {
  const cache = await caches.open(CACHE)
  const hit = await cache.match(req)
  if (hit) return hit
  const res = await fetch(req)
  cache.put(req, res.clone())
  return res
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE)
  try {
    const res = await fetch(req)
    cache.put(req, res.clone())
    return res
  } catch {
    const hit = await cache.match(req)
    if (!hit) throw new Error('offline and not saved')
    const headers = new Headers(hit.headers)
    headers.set('x-from-cache', 'yes')
    return new Response(hit.body, { status: hit.status, headers })
  }
}
