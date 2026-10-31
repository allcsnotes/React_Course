// FAKE payment provider for local lessons. It stands in for a provider's TEST MODE. No real money, no real keys.
import http from 'node:http'
import crypto from 'node:crypto'
import fs from 'node:fs'

const SECRET = 'whsec_test_not_a_real_secret'
const API_KEY = 'sk_test_not_a_real_key'
const HOOK = 'http://localhost:5203'
const FIRST_DELAY = 1500                              // a busy provider: the event leaves a moment after the payment
const RETRY_AFTER = [0, 2000, 5000, 5000]            // ms between attempts (real providers wait minutes and hours)

const sessions = new Map()
const events = new Map()
let n = 0

function sign(t, body) {
  return crypto.createHmac('sha256', SECRET).update(`${t}.${body}`).digest('hex')
}

async function deliver(ev, attempt = 1) {
  const { attempts, hook, ...payload } = ev
  const body = JSON.stringify(payload, null, 2)          // real providers send indented JSON too
  const t = Math.floor(Date.now() / 1000)
  const header = `t=${t},v1=${sign(t, body)}`
  let status = 0, answer = ''
  try {
    fs.writeFileSync(new URL('./last-webhook.json', import.meta.url), JSON.stringify({ header, body }))
    const r = await fetch(HOOK + hook, { method: 'POST', headers: { 'content-type': 'application/json', 'pay-signature': header }, body })
    status = r.status; answer = (await r.text()).slice(0, 60)
  } catch { status = 0 }
  ev.attempts.push({ attempt, status })
  console.log(`[provider] ${ev.id} attempt ${attempt} -> ${status || 'no answer'} ${answer.replace(/\s+/g, ' ')}`)
  if (status >= 200 && status < 300) return
  const wait = RETRY_AFTER[attempt]
  if (wait === undefined) { console.log(`[provider] ${ev.id} gave up after ${attempt} attempts`); return }
  setTimeout(() => deliver(ev, attempt + 1), wait)
}

const page = s => `<!doctype html><html><head><meta charset="utf-8"><title>Test checkout</title>
<style>body{margin:0;font-family:system-ui,sans-serif;background:#eef1f8;color:#16233f}
.top{background:#e25555;color:#fff;font-weight:700;font-size:20px;padding:8px 24px;text-align:center}
.box{max-width:560px;margin:18px auto;background:#fff;border-radius:18px;padding:18px 36px 22px;box-shadow:0 8px 30px rgba(0,0,0,.12)}
h1{font-size:32px;margin:0}.amt{font-size:40px;font-weight:800;margin:4px 0 8px}
.card{font-size:22px;border:2px solid #cfd6e6;border-radius:10px;padding:6px 16px;margin:6px 0;font-family:ui-monospace,monospace}
button{font-size:26px;font-weight:800;background:#1a7cff;color:#fff;border:0;border-radius:12px;padding:10px 0;width:100%;margin-top:8px}
</style></head><body><div class="top">FAKE TEST PROVIDER · no real money</div>
<div class="box"><h1>${s.description}</h1><div class="amt">Rs ${s.amount}</div>
<div class="card">4242 4242 4242 4242</div><div class="card">12 / 34 &nbsp; 123</div>
<form method="post" action="/pay/${s.id}"><button id="pay">Pay Rs ${s.amount} (test card)</button></form></div></body></html>`

const readBody = req => new Promise(r => { let b = ''; req.on('data', c => b += c); req.on('end', () => r(b)) })

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:8303')
  if (req.method === 'POST' && url.pathname === '/v1/sessions') {
    if (req.headers.authorization !== `Bearer ${API_KEY}`) { res.writeHead(401); return res.end('{"error":"bad key"}') }
    const b = JSON.parse(await readBody(req))
    const id = 'cs_test_' + crypto.randomBytes(5).toString('hex')
    sessions.set(id, { id, ...b, paid: false })
    res.writeHead(200, { 'content-type': 'application/json' })
    return res.end(JSON.stringify({ id, url: `http://localhost:8303/pay/${id}` }))
  }
  let m
  if ((m = url.pathname.match(/^\/pay\/(cs_test_\w+)$/))) {
    const s = sessions.get(m[1]); if (!s) { res.writeHead(404); return res.end('no such session') }
    if (req.method === 'GET') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(page(s)) }
    if (!s.paid) {
      s.paid = true
      const ev = { id: 'evt_test_' + String(++n).padStart(4, '0'), type: 'payment.succeeded', data: { session_id: s.id, order_id: s.order_id, amount: s.amount, currency: 'INR' }, hook: s.webhook_path || '/api/webhooks/pay', attempts: [] }
      events.set(ev.id, ev); setTimeout(() => deliver(ev), FIRST_DELAY)
    }
    res.writeHead(303, { location: s.success_url }); return res.end()
  }
  if (req.method === 'POST' && (m = url.pathname.match(/^\/v1\/events\/(evt_test_\w+)\/resend$/))) {
    const ev = events.get(m[1]); if (!ev) { res.writeHead(404); return res.end('no such event') }
    deliver(ev, ev.attempts.length + 1); res.writeHead(200); return res.end('resent ' + ev.id)
  }
  if (req.method === 'GET' && url.pathname === '/v1/events') {
    res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify([...events.values()].map(e => ({ id: e.id, type: e.type, attempts: e.attempts })), null, 1))
  }
  res.writeHead(404); res.end('not found')
}).listen(8303, () => console.log('[provider] fake test provider on http://localhost:8303'))
