// Two tiny helpers, written by us. They are not part of react.
export function watchKeys() {
  window.addEventListener(
    'input',
    (e) => {
      const t0 = e.timeStamp
      requestAnimationFrame(() => {
        setTimeout(() => console.log(`key painted after ${Math.round(performance.now() - t0)} ms`), 0)
      })
    },
    true,
  )
}

export function watchStart(t0: number) {
  requestAnimationFrame(() => {
    setTimeout(() => console.log(`page painted after ${Math.round(performance.now() - t0)} ms`), 0)
  })
}
