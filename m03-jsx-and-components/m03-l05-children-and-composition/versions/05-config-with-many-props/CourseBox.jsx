function CourseBox({
  title,
  subtitle,
  badgeText,
  showBadge,
  buttonText,
  showButton,
  note,
}) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="body">
        <p>{subtitle}</p>
        {showBadge && <span className="badge">{badgeText}</span>}
        {showButton && <button>{buttonText}</button>}
        <p>{note}</p>
      </div>
    </div>
  )
}

export default CourseBox
