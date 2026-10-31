import { Suspense } from 'react'
import CourseList from '@/components/CourseList'

type Params = PageProps<'/'>['searchParams']

async function Catalog({ searchParams }: { searchParams: Params }) {
  const { q } = await searchParams
  const query = typeof q === 'string' ? q : ''
  return (
    <>
      <form action="/" role="search" className="search">
        <label>
          Search courses
          <input name="q" defaultValue={query} />
        </label>
        <button className="btn">Search</button>
      </form>
      <CourseList q={query} />
    </>
  )
}

export default function Home(props: PageProps<'/'>) {
  return (
    <>
      <h1>Courses</h1>
      <Suspense fallback={<p className="muted">Loading courses…</p>}>
        <Catalog searchParams={props.searchParams} />
      </Suspense>
    </>
  )
}
