// the spy: logs every change to the real page and flashes the changed part
(function () {
  const css = document.createElement('style')
  css.textContent = '.spy-flash{outline:5px solid #ffb800 !important;outline-offset:2px;background-color:#fff0b8 !important}'
  document.head.appendChild(css)
  window.__spy = []
  window.__spyReset = () => { window.__spy.length = 0 }
  const tag = n => '<' + (n.nodeName || '').toLowerCase() + '>'
  const real = n => n.nodeType === 1 || (n.nodeType === 3 && n.data.trim() !== '')
  const obs = new MutationObserver(records => {
    obs.disconnect()
    document.querySelectorAll('.spy-flash').forEach(e => e.classList.remove('spy-flash'))
    for (const m of records) {
      let line = ''
      let el = null
      if (m.type === 'attributes' && (m.attributeName === 'style' || m.attributeName === 'name' || m.oldValue === m.target.getAttribute(m.attributeName))) continue
      if (m.type === 'childList' && ![...m.addedNodes, ...m.removedNodes].some(real)) continue
      if (m.type === 'characterData') {
        line = 'characterData "' + m.oldValue + '" -> "' + m.target.data + '"'
        el = m.target.parentElement
      } else if (m.type === 'attributes') {
        const v = (m.target.getAttribute(m.attributeName) || '').replace('spy-flash', '').trim()
        line = 'attributes ' + m.attributeName + ' on ' + tag(m.target) + ': "' + (m.oldValue || '') + '" -> "' + v + '"'
        el = m.target
      } else {
        const add = [...m.addedNodes].filter(real).map(tag), rem = [...m.removedNodes].filter(real).map(tag)
        line = 'childList in ' + tag(m.target) + (add.length ? ' +' + add.join(' +') : '') + (rem.length ? ' -' + rem.join(' -') : '')
        el = [...m.addedNodes].find(n => n.nodeType === 1) || m.target
      }
      window.__spy.push(line)
      if (el && el.classList) el.classList.add('spy-flash')
    }
    obs.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeOldValue: true, characterData: true, characterDataOldValue: true })
  })
  obs.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeOldValue: true, characterData: true, characterDataOldValue: true })
  window.__spyQuiet = () => { obs.takeRecords(); obs.disconnect(); document.querySelectorAll('.spy-flash').forEach(e => e.classList.remove('spy-flash')); window.__spy.length = 0
    obs.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeOldValue: true, characterData: true, characterDataOldValue: true }) }
})()
