function Panel({ title, footer, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="body">{children}</div>
      {footer && (
        <div className="foot">{footer}</div>
      )}
    </section>
  )
}

export default Panel
