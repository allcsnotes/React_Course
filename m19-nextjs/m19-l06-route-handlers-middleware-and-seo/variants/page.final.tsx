import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>allcsvideos</h1>
      <p>Short, clear video courses for people who code.</p>
      <Link href="/courses">See all courses</Link>
    </main>
  )
}
