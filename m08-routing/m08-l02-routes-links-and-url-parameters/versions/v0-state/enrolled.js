export function getEnrolled() {
  return JSON.parse(localStorage.getItem('enrolled') ?? '[]')
}

export function enroll(slug) {
  const list = getEnrolled()
  if (!list.includes(slug)) {
    localStorage.setItem(
      'enrolled',
      JSON.stringify([...list, slug]),
    )
  }
}
