function Header() {
  return <h2>allcsvideos</h2>
}

function Greeting() {
  return <p>Hello, Lukas! Pick a course and start learning.</p>
}

function Footer() {
  return <p>Made by Asha</p>
}

export default function Ex01() {
  return (
    <div className="card">
      <Header />
      <Greeting />
      <Footer />
    </div>
  )
}
