export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <h2 className="bar">All courses</h2>
      {children}
    </section>
  )
}
