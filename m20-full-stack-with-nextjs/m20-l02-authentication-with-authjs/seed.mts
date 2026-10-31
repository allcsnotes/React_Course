import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const people = [
  ['lukas@example.com', 'Lukas', 'learn-react-7', 'student'],
  ['meera@example.com', 'Meera', 'teach-react-8', 'instructor'],
  ['asha@example.com', 'Asha', 'admin-react-9', 'admin'],
]
await pool.query('truncate enrollments, users restart identity cascade')
for (const [email, name, password, role] of people) {
  const hash = await bcrypt.hash(password, 10)
  await pool.query('insert into users (email, name, password_hash, role) values ($1, $2, $3, $4)', [email, name, hash, role])
}
console.log('seeded', people.length, 'users')
await pool.end()
