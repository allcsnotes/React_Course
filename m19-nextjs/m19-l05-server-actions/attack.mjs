const SITE = 'http://localhost:5195/'
const html = await (await fetch(SITE)).text()
const id = html.match(/ACTION_ID_(\w+)/)[1]
const form = new FormData()
form.set('$ACTION_ID_' + id, '')
form.set('id', 'r1')
const res = await fetch(SITE, { method: 'POST', body: form })
console.log('action', id.slice(0, 8) + '…', '→ status', res.status)
