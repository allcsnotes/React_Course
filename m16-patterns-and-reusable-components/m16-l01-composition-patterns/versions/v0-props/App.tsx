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
        <Tabs
          tabs={[
            { label: 'About', content: <p>24 lessons with Meera.</p> },
            { label: 'Lessons', content: <p>Start with JSX.</p> },
            {
              label: 'Reviews',
              icon: '★',
              badge: 12,
              content: <p>Lukas: clear and calm.</p>,
            },
          ]}
          showIcons
          showBadges
          footer={<p className="foot">Updated this week</p>}
          onChange={(i) => console.log('tab', i)}
        />
      </main>
    </>
  )
}
