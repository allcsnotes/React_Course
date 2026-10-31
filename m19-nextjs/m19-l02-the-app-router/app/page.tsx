import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>Learn by building</h1>
      <p>Short courses from Meera, Asha and Rahul.</p>
      <Link href="/courses" className="cta">See the courses</Link>
    </main>
  )
}
