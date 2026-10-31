function CourseBanner() {
  return (
    <>
      <h3 className="title">React for Beginners</h3>
      <img src="/favicon.svg" alt="React for Beginners logo" width="40" />
      <p>by Meera</p>
    </>
  )
}

export default function Ex02() {
  return (
    <div className="card">
      <CourseBanner />
    </div>
  )
}
