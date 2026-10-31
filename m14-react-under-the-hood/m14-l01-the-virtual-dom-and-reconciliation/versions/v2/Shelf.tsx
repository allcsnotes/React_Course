type Props = { sale: boolean, hot: boolean, big: boolean }

export function Shelf({ sale, hot, big }: Props) {
  console.log('Shelf render')
  const cls = hot ? 'hot' : ''
  return (
    <section>
      {big ? <h2>React</h2> : <p>React</p>}
      <p className={cls}>Rs {sale ? 299 : 499}</p>
    </section>
  )
}
