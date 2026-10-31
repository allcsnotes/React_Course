function Panel({ title, children }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      {children}
    </section>
  )
}

function Highlight({ children }) {
  return <strong className="free">{children}</strong>
}

export default function Ex06() {
  return (
    <div>
      <Panel title="Today">
        <p>
          Priya starts <Highlight>System Design</Highlight> with Rahul.
        </p>
      </Panel>
      <Panel title="Free this week">
        <ul>
          <li>Python from Zero</li>
          <li>DevOps Basics</li>
        </ul>
      </Panel>
      <Panel title="Empty panel" />
    </div>
  )
}
