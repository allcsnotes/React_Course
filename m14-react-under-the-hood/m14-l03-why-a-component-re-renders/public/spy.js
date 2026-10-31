const root = document.getElementById('root')
const spy = new MutationObserver((list) => {
  for (const r of list) {
    const el = r.target.parentElement
    if (el.closest('.cnt')) continue
    console.log(r.type, r.target.textContent)
  }
})
spy.observe(root, {
  subtree: true,
  childList: true,
  characterData: true,
  attributes: true,
})
