import Panel from './Panel.jsx'

export default function App() {
  return (
    <div className="page">
      <Panel
        title="Python from Zero"
        footer={<button>Enroll</button>}
      >
        <p>by Meera · 20 lessons</p>
      </Panel>
      <Panel title="Announcement">
        <p>New batch on Monday.</p>
      </Panel>
    </div>
  )
}
