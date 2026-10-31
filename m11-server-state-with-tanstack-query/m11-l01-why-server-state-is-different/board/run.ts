import { API, getCached } from './cache.ts'

const get = () => getCached('/api/courses')
const price = async () => (await get())[0].price
const wait = (ms: number) => new Promise(r => setTimeout(r, ms))
const sale = '/sale?slug=react-for-beginners&price=299'

console.log('two at once :', await Promise.all([price(), price()]))
console.log('again       :', await price())
await fetch(API + sale, { method: 'POST' })
console.log('after sale  :', await price())
await wait(2500)
console.log('copy is old :', await price())
await wait(500)
console.log('a moment on :', await price())
