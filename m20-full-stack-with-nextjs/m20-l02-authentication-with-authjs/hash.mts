import bcrypt from 'bcryptjs'

const a = await bcrypt.hash('learn-react-7', 10)
const b = await bcrypt.hash('learn-react-7', 10)
console.log(a)
console.log(b)
console.log(await bcrypt.compare('learn-react-7', a))
console.log(await bcrypt.compare('learn-react-8', a))
