// Makes the two test files used in the video, in this folder (nothing is downloaded):
//   react-thumbnail.png  a valid PNG of about 6.2 MB (a 6.5 MB private chunk makes the upload slow enough to watch)
//   notes.txt            a plain text file, to test "Pick a PNG or a JPEG"
import fs from 'node:fs'
import zlib from 'node:zlib'
import crypto from 'node:crypto'

const here = new URL('.', import.meta.url).pathname
const table = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc = buf => {
  let c = 0xffffffff
  for (const x of buf) c = table[(c ^ x) & 255] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type), data])
  const sum = Buffer.alloc(4)
  sum.writeUInt32BE(crc(body))
  return Buffer.concat([len, body, sum])
}

const W = 640, H = 360
const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(W, 0)
ihdr.writeUInt32BE(H, 4)
ihdr.set([8, 2, 0, 0, 0], 8) // 8-bit RGB
const row = Buffer.concat([Buffer.from([0]), Buffer.from(Array.from({ length: W }, () => [26, 124, 255]).flat())])
const raw = Buffer.concat(Array.from({ length: H }, () => row))
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw)),
  chunk('prVt', crypto.randomBytes(6_500_000)),
  chunk('IEND', Buffer.alloc(0)),
])
fs.writeFileSync(here + 'react-thumbnail.png', png)
fs.writeFileSync(here + 'notes.txt', 'plain text, not a picture\n')
console.log('react-thumbnail.png', png.length, 'bytes')
