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
              <Button type="submit">Enroll</Button>
              <span className="cap">type="submit"</span>
            </div>
            <div className="cell">
              <Button disabled>Sold out</Button>
              <span className="cap">disabled</span>
            </div>
            <div className="cell">
              <Button className="wide" aria-label="Preview the course">Preview</Button>
              <span className="cap">className="wide"</span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
