import { Button } from './Button.tsx'

export default function App() {
  return (
    <main>
      <Button as="link" onClick={() => {}}>Syllabus</Button>
      <Button href="#syllabus">Syllabus</Button>
      <Button as="link">Syllabus</Button>
    </main>
  )
}
