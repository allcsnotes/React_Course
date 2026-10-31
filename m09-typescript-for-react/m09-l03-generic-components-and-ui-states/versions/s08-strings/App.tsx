import { List } from './List'

const tags = ['new', 'free', 'popular']

export default function App() {
  return (
    <main>
      <section>
        <h2>Tags</h2>
        <List items={tags} renderItem={t => <>{t}</>} />
      </section>
    </main>
  )
}
