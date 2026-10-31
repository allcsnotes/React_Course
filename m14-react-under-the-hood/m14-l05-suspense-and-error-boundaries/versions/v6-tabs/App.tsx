import { Suspense, useState } from 'react'
import { Header } from './Header.tsx'
import { LessonList } from './LessonList.tsx'

export default function App() {
  const [slug, setSlug] = useState('react-for-beginners')
  return (
    <>
      <Header />
      <main>
        <section>
          <h2>Lessons</h2>
          <button className={slug === 'react-for-beginners' ? 'tab on' : 'tab'} onClick={() => setSlug('react-for-beginners')}>React</button>{' '}
          <button className={slug === 'python-from-zero' ? 'tab on' : 'tab'} onClick={() => setSlug('python-from-zero')}>Python</button>
          <Suspense fallback={<p className="wait">Loading lessons…</p>}>
            <LessonList slug={slug} />
          </Suspense>
        </section>
      </main>
    </>
  )
}
