// Makes the three test files used in the video, in this folder (nothing is downloaded):
//   course-thumb.png  a valid PNG of about 1.5 MB, small enough (under 2 MB) to be accepted
//   huge-thumb.png    a valid PNG of about 3.4 MB, too big: the page must refuse it
//   notes.txt         a plain text file, to test "Pick a picture file"
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

// a plain blue picture, plus a private chunk of random bytes to make the file as big as we want
function makePng(extraBytes) {
  const W = 640, H = 360
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(W, 0)
  ihdr.writeUInt32BE(H, 4)
  ihdr.set([8, 2, 0, 0, 0], 8) // 8-bit RGB
  const row = Buffer.concat([Buffer.from([0]), Buffer.from(Array.from({ length: W }, () => [26, 124, 255]).flat())])
  const raw = Buffer.concat(Array.from({ length: H }, () => row))
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('prVt', crypto.randomBytes(extraBytes)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

for (const [name, extra] of [['course-thumb.png', 1_500_000], ['huge-thumb.png', 3_400_000]]) {
  const png = makePng(extra)
  fs.writeFileSync(here + name, png)
  console.log(name, png.length, 'bytes')
}
fs.writeFileSync(here + 'notes.txt', 'plain text\n')
