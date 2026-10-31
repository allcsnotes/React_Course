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
        <Tabs initial="about">
          <Tabs.List>
            <Tabs.Tab value="about">About</Tabs.Tab>
            <Tabs.Tab value="lessons">Lessons</Tabs.Tab>
            <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="about">
            <p>24 lessons with Meera.</p>
          </Tabs.Panel>
          <Tabs.Panel value="lessons">
            <p>Start with JSX.</p>
          </Tabs.Panel>
          <Tabs.Panel value="review">
            <p>Lukas: clear and calm.</p>
          </Tabs.Panel>
        </Tabs>
      </main>
    </>
  )
}
