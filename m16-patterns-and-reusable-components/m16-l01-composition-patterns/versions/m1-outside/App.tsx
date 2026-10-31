import { Tabs } from './Tabs'

export default function App() {
  return (
    <>
      <header>
        <strong>allcsvideos</strong>
        <span className="tag">Course page</span>
      </header>
      <main>
        <h2>React for Beginners</h2>
        <Tabs.Tab value="about">About</Tabs.Tab>
      </main>
    </>
  )
}
