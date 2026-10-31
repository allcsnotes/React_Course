// Run from the project folder (needs the `sharp` package, which Next.js installs): node scripts/makebanner.mjs
// generates public/banner.jpg: a 2400x1350 "photo-like" banner (gradients, soft shapes, film grain) with sharp
import fs from 'node:fs'
import sharp from 'sharp'
fs.mkdirSync('public', { recursive: true })
const W = 2400, H = 1350
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
const circles = Array.from({ length: 26 }, () => `<circle cx="${rnd() * W}" cy="${rnd() * H}" r="${60 + rnd() * 260}" fill="hsl(${200 + rnd() * 60},70%,${30 + rnd() * 40}%)" opacity="${0.25 + rnd() * 0.4}"/>`).join('')
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1b33"/><stop offset="1" stop-color="#1a7cff"/></linearGradient><filter id="b"><feGaussianBlur stdDeviation="40"/></filter></defs><rect width="100%" height="100%" fill="url(#g)"/><g filter="url(#b)">${circles}</g></svg>`
const noise = Buffer.alloc(W * H * 3); for (let i = 0; i < noise.length; i++) noise[i] = 128 + Math.round((rnd() - .5) * 90)
const base = await sharp(Buffer.from(svg)).png().toBuffer()
await sharp(base).composite([{ input: await sharp(noise, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer(), blend: 'soft-light' }]).jpeg({ quality: 88 }).toFile('public/banner.jpg')
