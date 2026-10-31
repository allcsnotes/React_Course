import { Card } from './Card'

export default function App() {
  return (
    <>
      <header>
        <strong>allcsvideos</strong>
        <span className="tag">Course page</span>
      </header>
      <main>
        <Card
          header={
            <>
              <h2>React for Beginners</h2>
              <span className="tag">New</span>
            </>
          }
          footer={<button>Enroll</button>}
        >
          <p>24 lessons with Meera.</p>
        </Card>
        <Card header={<h2>Announcement</h2>}>
          <p>Live Q and A on Friday.</p>
        </Card>
      </main>
    </>
  )
}
