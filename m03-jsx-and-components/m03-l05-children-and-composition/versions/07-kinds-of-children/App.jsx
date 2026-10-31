import Card from './Card.jsx'

export default function App() {
  return (
    <div className="page">
      <Card title="A string">
        Just some text
      </Card>
      <Card title="One element">
        <p>by Meera</p>
      </Card>
      <Card title="Two elements">
        <p>by Meera</p>
        <button>Enroll</button>
      </Card>
      <Card title="Nothing" />
    </div>
  )
}
