import { List } from './List'

const tags = [{ name: 'new' }, { name: 'free' }]

export default function App() {
  return (
    <main>
      <section>
        <h2>Tags</h2>
        <List items={tags} renderItem={t => <>{t.name}</>} />
      </section>
    </main>
  )
}
