const spy = new MutationObserver(list => {
  for (const m of list) {
    console.log(m.type, m.target.nodeName)
  }
})
const options = { subtree: true,
  childList: true, characterData: true,
  attributes: true }
spy.observe(document.body, options)
