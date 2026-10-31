interface PanelProps {
  title: string
}

export default function Panel({
  title,
  children,
}: PanelProps) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  )
}
