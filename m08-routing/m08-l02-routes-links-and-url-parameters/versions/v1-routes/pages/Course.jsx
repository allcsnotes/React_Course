import { useParams } from 'react-router'
import Header from '../Header.jsx'

export default function Course() {
  const { slug } = useParams()
  console.log(slug, typeof slug)

  return (
    <>
      <Header />
      <main>
        <h2>The slug is:</h2>
        <p className="slug">{slug}</p>
      </main>
    </>
  )
}
