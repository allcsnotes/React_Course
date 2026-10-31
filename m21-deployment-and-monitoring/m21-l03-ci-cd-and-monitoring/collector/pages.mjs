// two tiny pages for the collector: the errors and the real-user numbers (a stand-in for a service dashboard)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const CSS = `body{margin:0;font-family:system-ui,sans-serif;background:#f3f5f9;color:#14213d}
header{display:flex;gap:26px;align-items:center;padding:0 22px;height:84px;background:#fff;border-bottom:2px solid #d5dbe8;font-size:30px;font-weight:800}
header span{color:#55627d;font-weight:700}header a{text-decoration:none;color:#55627d}header a.on{color:#1a7cff}
main{padding:20px 22px}h2{font-size:28px;color:#55627d;margin:0 0 16px}
.row{background:#fff;border:2px solid #d5dbe8;border-radius:12px;padding:12px 18px;margin-bottom:14px;font-size:26px}
.row b{display:block;font-size:28px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.row small{display:block;font-size:24px;color:#55627d;margin-top:4px}
.src{color:#1a7cff;font-weight:800}table{width:100%;border-collapse:collapse;font-size:32px;background:#fff;border:2px solid #d5dbe8}
td,th{padding:14px 16px;text-align:left;border-bottom:2px solid #eef1f7}th{color:#55627d;font-size:24px}
.good{color:#18864b;font-weight:800}`
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)] }
const nav = (on) => `<header>Collector <span>local stand-in</span><a id="n1" class="${on === 1 ? 'on' : ''}" href="/">Errors</a><a id="n2" class="${on === 2 ? 'on' : ''}" href="/vitals">Real users</a></header>`
export function page(url, events) {
  if (url === '/vitals') {
    const rows = ['LCP', 'INP', 'CLS'].map((n) => {
      const v = events.filter((e) => e.kind === 'vital' && e.name === n)
      if (!v.length) return ''
      const vals = v.map((e) => e.value), unit = n === 'CLS' ? '' : ' ms', f = (x) => (n === 'CLS' ? x.toFixed(2) : Math.round(x)) + unit
      return `<tr id="v_${n}"><td><b>${n}</b></td><td>${v.length}</td><td>${f(med(vals))}</td><td>${f(Math.max(...vals))}</td><td class="good">${v.filter((e) => e.rating === 'good').length} of ${v.length}</td></tr>`
    }).join('')
    return `<!doctype html><meta charset="utf-8"><style>${CSS}</style>${nav(2)}<main><h2>Numbers from real visits</h2><table><tr><th>Metric</th><th>Visits</th><th>Middle</th><th>Worst</th><th>Good</th></tr>${rows}</table></main>`
  }
  const errs = events.filter((e) => e.kind !== 'vital')
  const rows = errs.map((e, i) => `<div class="row" id="e${i}"><b>${esc(e.message)}</b><small>${e.kind === 'render' ? 'draw error' : 'window error'} · <span class="src">${esc(e.source ?? 'unknown')}</span> · release ${esc(e.release)}</small></div>`).join('')
  return `<!doctype html><meta charset="utf-8"><style>${CSS}</style>${nav(1)}<main><h2>${errs.length} errors received</h2>${rows}</main>`
}
