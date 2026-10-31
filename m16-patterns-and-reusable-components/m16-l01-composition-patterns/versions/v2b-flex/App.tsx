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
        <Tabs initial="reviews">
          <Tabs.List>
            <Tabs.Tab value="about">About</Tabs.Tab>
            <Tabs.Tab value="lessons">Lessons</Tabs.Tab>
            <Tabs.Tab value="reviews">
              ★ Reviews <span className="badge">12</span>
            </Tabs.Tab>
            <button className="link">Write a review</button>
          </Tabs.List>
          <Tabs.Panel value="about">
            <p>24 lessons with Meera.</p>
          </Tabs.Panel>
          <Tabs.Panel value="lessons">
            <p>Start with JSX.</p>
          </Tabs.Panel>
          <Tabs.Panel value="reviews">
            <p>Lukas: clear and calm.</p>
            <p className="foot">Updated this week</p>
          </Tabs.Panel>
        </Tabs>
      </main>
    </>
  )
}
