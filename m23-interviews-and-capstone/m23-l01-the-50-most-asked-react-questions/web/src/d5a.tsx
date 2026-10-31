import { memo, useState } from 'react'

type Props = { tags: string[] }

const Row = memo(({ tags }: Props) => {
  console.log('Row render')
  return <p>{tags.join(', ')}</p>
})

export default function D5a() {
  const [n, setN] = useState(0)
  return (
    <main>
      <h1>clicks: {n}</h1>
      <button onClick={() => setN(n + 1)}>add one</button>
      <Row tags={['a', 'b']} />
    </main>
  )
}
