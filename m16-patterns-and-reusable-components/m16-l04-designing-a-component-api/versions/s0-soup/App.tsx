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
              <Button primary>Enroll</Button>
              <span className="cap">primary</span>
            </div>
            <div className="cell">
              <Button primary danger>Remove</Button>
              <span className="cap">primary danger</span>
            </div>
            <div className="cell">
              <Button small large>Buy</Button>
              <span className="cap">small large</span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
