import { memo, useState } from 'react'

type Props = { tags: string[] }

const Row = memo(({ tags }: Props) => {
  console.log('Row render')
  return <p>{tags.join(', ')}</p>
})

const TAGS = ['a', 'b']

export default function D5b() {
  const [n, setN] = useState(0)
  return (
    <main>
      <h1>clicks: {n}</h1>
      <button onClick={() => setN(n + 1)}>add one</button>
      <Row tags={TAGS} />
    </main>
  )
}
