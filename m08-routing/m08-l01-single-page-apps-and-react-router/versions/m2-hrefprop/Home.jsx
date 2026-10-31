import { Link } from 'react-router'

export default function Home() {
  return (
    <main className="page">
      <h1>Welcome to allcsvideos</h1>
      <p>Learn by building.</p>
      <Link href="/catalog">Catalog</Link>
    </main>
  )
}
