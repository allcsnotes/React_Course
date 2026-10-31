const n = 1234567.5
for (const lng of ['en-US', 'de-DE', 'en-IN', 'ar-EG']) {
  const money = new Intl.NumberFormat(lng, { style: 'currency', currency: 'EUR' }).format(n)
  console.log(lng.padEnd(6), new Intl.NumberFormat(lng).format(n).padEnd(16), money)
}
const d = new Date('2026-12-05T12:00:00Z')
for (const lng of ['en-US', 'en-GB', 'de-DE', 'hi-IN', 'ar-EG']) {
  console.log(lng.padEnd(6), new Intl.DateTimeFormat(lng, { dateStyle: 'long', timeZone: 'UTC' }).format(d))
}
