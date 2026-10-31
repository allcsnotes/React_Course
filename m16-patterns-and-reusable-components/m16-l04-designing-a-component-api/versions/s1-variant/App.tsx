import { Button } from './Button.tsx'

export default function App() {
  return (
    <>
      <header><strong>allcsvideos · components</strong><span className="tag">demo</span></header>
      <main>
        <div className="panel">
          <h2>Priya's course page</h2>
          <div className="row">
            <div className="cell">
              <Button>Enroll</Button>
              <span className="cap">(no props)</span>
            </div>
            <div className="cell">
              <Button variant="danger">Remove</Button>
              <span className="cap">variant="danger"</span>
            </div>
            <div className="cell">
              <Button variant="secondary" size="lg">Preview</Button>
              <span className="cap">secondary, lg</span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
