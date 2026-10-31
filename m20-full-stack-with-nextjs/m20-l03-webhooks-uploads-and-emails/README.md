# M20-L03 · Webhooks, Uploads and Emails

> Video: Module 20, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- What a webhook is, and why the page Lukas returns to proves nothing about a payment
- How to check a webhook signature (HMAC SHA-256) on the raw body, and refuse old messages
- Idempotency: saving the event id so a repeated message does its work once, and why retries rescue payments
- How to send an email with Nodemailer, and catch it with Mailpit so no real mail is ever sent
- How to accept a file upload (multipart), check type and size, and choose the file name yourself
- Three real mistakes: parsing before verifying, marking the event done too early, and trusting the file name

## Before you start

- Node 24 (`node --version`) and Docker Desktop running.
- Best after M20-L01 (Drizzle and Postgres) in `../m20-l01-a-database-from-nextjs/`.
- No real money, no real keys, no real accounts. The payment provider is a small FAKE one that runs on your computer (`provider/server.mjs`). Its page says "FAKE TEST PROVIDER". The keys `sk_test_not_a_real_key` and `whsec_test_not_a_real_secret` and the database password `devpass` are demo values. Mailpit keeps every email on your machine.
- Ports used: 5203 (the shop), 8303 (fake provider), 5403 (Postgres), 1203 (Mailpit mail in), 8203 (Mailpit web page).

## Files in this folder

| File | What it is |
|------|------------|
| `app/page.tsx`, `app/actions.ts` | The shop and the `buy` server action: save the order, ask the provider for a payment page, redirect |
| `lib/provider.ts` | Asks the fake provider for a payment session |
| `lib/signature.ts` | `verify(raw, header)`: HMAC check with `timingSafeEqual` and a 5 minute limit |
| `app/api/webhooks/pay/route.ts` | The real webhook handler (verify, store event id, update order, send receipt) |
| `app/api/webhooks/bad-parse/route.ts` | Mistake 1: parses the body before verifying |
| `app/api/webhooks/bad-order/route.ts` | Mistake 2: marks the event done first |
| `lib/mail.ts` | Nodemailer transport to Mailpit and `sendReceipt` |
| `app/instructor/page.tsx` | Upload form (`multipart/form-data`) and the latest thumbnail |
| `app/api/upload/route.ts` | The real upload handler |
| `app/api/upload-bad/route.ts` | Mistake 3: saves under the file name the caller sent |
| `app/files/[name]/route.ts` | Serves a file from the `uploads` folder |
| `app/success/page.tsx` | Where the browser comes back to: shows the order status |
| `lib/schema.ts`, `lib/db.ts`, `drizzle/` | `orders` and `webhook_events` tables, connection, migration |
| `provider/server.mjs` | The fake test provider: payment page, signed webhooks, retries |
| `thumb.png`, `notes.txt` | Test files for the upload |
| `.env.example` | Demo settings. Copy to `.env.local` |

## Follow along

### 1. Install and start Postgres and Mailpit

```bash
npm install
cp .env.example .env.local
docker run -d --name m20l03-pg -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=shop -p 5403:5432 postgres:17-alpine
docker run -d --name m20l03-mail -p 1203:1025 -p 8203:8025 axllent/mailpit:v1.32.0
# wait about 5 seconds, then create the tables
npx drizzle-kit migrate
```
```text
[✓] migrations applied successfully!
```
Mailpit is a pretend post office: mail goes in on port 1203, and you read it at http://localhost:8203. Build and start the shop (a production build, like the video), then start the fake provider in a second terminal:
```bash
npm run build
npm run start -- -p 5203
```
```bash
node provider/server.mjs
```
```text
[provider] fake test provider on http://localhost:8303
```
The build lists `/`, `/api/upload`, `/api/webhooks/pay`, `/files/[name]`, `/instructor` and `/success` (and the three "bad" routes).

### 2. The happy path: buy, pay, pending, paid

Open http://localhost:5203, press Buy this course. The server action saves an order as pending, asks the provider for a payment page (with the secret key from `.env.local`) and redirects. You see the fake provider page with the test card `4242 4242 4242 4242`. Press Pay. The browser goes back to the shop:
```text
Order 1 | React for Beginners | Status: pending | Still pending? Refresh in a moment.
```
After about 1.5 seconds (the provider waits, like a busy company), reload:
```text
Order 1 | React for Beginners | Status: paid
```
The browser road and the webhook road are separate, and the browser can win the race. The provider log (second terminal) shows the delivery:
```text
[provider] evt_test_0001 attempt 1 -> 200 {"ok":true}
```
Only the webhook marks the order paid. Check the database and Mailpit:
```bash
docker exec m20l03-pg psql -U postgres -d shop -c "select id, status from orders"
```
```text
 id | status
----+--------
  1 | paid
(1 row)
```
In http://localhost:8203 there is one message to `lukas@example.test`, subject "Your receipt: React for Beginners", text "Thank you! You now own "React for Beginners". Order 1, paid Rs 499 (test mode)."

### 3. What a webhook message looks like

The provider remembers the last message in `provider/last-webhook.json`. The header holds the time and the signature, the body is indented JSON:
```text
pay-signature: t=1793437025,v1=c63e58cfde47023f2f27a447a988364db0a7ceeb5d1ed142e86cac88eb9f0896
```
```json
{
  "id": "evt_test_0001",
  "type": "payment.succeeded",
  "data": { "session_id": "cs_test_1588819f9f", "order_id": 1, "amount": 499, "currency": "INR" }
}
```
(Your time, signature and session id differ.) The signature is an HMAC: the provider mixes the secret with the time, a dot and the body, and gets a long code. The secret itself never travels. `lib/signature.ts` does the same mixing and compares:
```ts
const expected = createHmac('sha256', SECRET).update(`${t}.${raw}`).digest('hex')
const got = Buffer.from(parts.v1 ?? '', 'hex')
const want = Buffer.from(expected, 'hex')
if (got.length !== want.length) return 'bad signature'
if (!timingSafeEqual(got, want)) return 'bad signature'
if (Math.abs(Date.now() / 1000 - t) > 300) return 'too old'
return 'ok'
```
`timingSafeEqual` takes the same time however many letters match. The handler reads the body as plain text with `req.text()`, calls `verify`, and answers 400 if it is not `ok`.

### 4. Three fake messages

Guess first: a thief sends three messages (no signature; a real signature but a changed order number; a real message signed again with a time from one hour ago). Does order 2 get paid? Make a pending order 2 and a few files from the last message:
```bash
docker exec m20l03-pg psql -U postgres -d shop -c "insert into orders(course,amount) values ('React for Beginners',499)"
node -e "
const w=JSON.parse(require('fs').readFileSync('provider/last-webhook.json')); const fs=require('fs'); const crypto=require('crypto');
fs.writeFileSync('real.body', w.body); fs.writeFileSync('real.hdr', 'pay-signature: '+w.header);
fs.writeFileSync('forged.json', JSON.stringify({id:'evt_test_9999',type:'payment.succeeded',data:{session_id:'cs_test_fake',order_id:2,amount:499,currency:'INR'}},null,2));
const t=Math.floor(Date.now()/1000)-3600; const sig=crypto.createHmac('sha256','whsec_test_not_a_real_secret').update(t+'.'+w.body).digest('hex');
fs.writeFileSync('old.hdr','pay-signature: t='+t+',v1='+sig);
const tam=JSON.parse(w.body); tam.data.order_id=2; fs.writeFileSync('tampered.json', JSON.stringify(tam,null,2));"
curl -s localhost:5203/api/webhooks/pay --data-binary @forged.json
curl -s localhost:5203/api/webhooks/pay -H @real.hdr --data-binary @tampered.json
curl -s localhost:5203/api/webhooks/pay -H @old.hdr --data-binary @real.body
docker exec m20l03-pg psql -U postgres -d shop -c "select id, status from orders"
```
```text
{"error":"bad signature"}
{"error":"bad signature"}
{"error":"too old"}
 id | status
----+---------
  1 | paid
  2 | pending
(2 rows)
```
No signature: bad signature. The real header on a changed body: bad signature (one changed number gives a completely different code). The old message: too old, so a recorded message cannot be replayed later. Order 2 stays pending. (Delete the helper files afterwards: `rm real.body real.hdr forged.json old.hdr tampered.json`.)

### 5. The same message twice: idempotency

Providers deliver at least once, so sometimes twice. The handler stores the event id (the primary key of `webhook_events`) with `onConflictDoNothing()`, and does the insert and the order update in one transaction. If no row was saved, it answers `{ ok: true, duplicate: true }` and stops.
```ts
const order = await db.transaction(async tx => {
  const [seen] = await tx.insert(webhookEvents)
    .values({ id: event.id, type: event.type })
    .onConflictDoNothing().returning()
  if (!seen) return null
  const [row] = await tx.update(orders).set({ status: 'paid' })
    .where(eq(orders.id, event.data.order_id)).returning()
  return row
})
if (!order) return Response.json({ ok: true, duplicate: true })
```
The fake provider has a resend button (an API call):
```bash
curl -s -X POST localhost:8303/v1/events/evt_test_0001/resend
docker exec m20l03-pg psql -U postgres -d shop -c "select id, type from webhook_events"
curl -s localhost:8203/api/v1/messages | grep -o '"total":[0-9]*'
```
```text
resent evt_test_0001
       id       |       type
---------------+-------------------
 evt_test_0001 | payment.succeeded
(1 row)

"total":1
```
The provider log shows `evt_test_0001 attempt 2 -> 200 {"ok":true,"duplicate":true}`. One row, one email.

### 6. Retries rescue a payment

If our server answers with an error, or does not answer, the provider tries again. Real providers wait minutes and hours; the fake one waits 2 s, 5 s, 5 s (four attempts in all). To make our server fail for real, stop the database and let a payment arrive. From the terminal: create an order, ask the provider for a payment session, stop the database, pay, and start the database again.
```bash
HOOK=/api/webhooks/pay     # the webhook address the provider will call
ORDER=$(docker exec m20l03-pg psql -U postgres -d shop -tAc "insert into orders(course,amount) values ('React for Beginners',499) returning id" | head -1)
SESSION=$(curl -s -X POST localhost:8303/v1/sessions -H 'authorization: Bearer sk_test_not_a_real_key' -d "{\"order_id\":$ORDER,\"amount\":499,\"description\":\"React for Beginners\",\"success_url\":\"http://localhost:5203/success?order=$ORDER\",\"webhook_path\":\"$HOOK\"}" | grep -o 'cs_test_[0-9a-f]*' | head -1)
docker stop m20l03-pg
curl -s -o /dev/null -X POST localhost:8303/pay/$SESSION
sleep 5; docker start m20l03-pg
```
Wait about 8 seconds. The provider log:
```text
[provider] evt_test_0002 attempt 1 -> 500
[provider] evt_test_0002 attempt 2 -> 500
[provider] evt_test_0002 attempt 3 -> 200 {"ok":true}
```
```bash
docker exec m20l03-pg psql -U postgres -d shop -tAc "select id, status from orders where id = $ORDER"
docker exec m20l03-pg psql -U postgres -d shop -tAc "select id from webhook_events"
```
```text
3|paid
evt_test_0001
evt_test_0002
```
The order is paid, there is one new event row, and one email for that order. The retry rescued a payment that would have been lost. (Your order number may differ.)

### 7. The receipt email

`lib/mail.ts` points Nodemailer at Mailpit and sends after the order is saved as paid. If the email fails, the handler only logs it: a broken mail server must never turn a paid order into a failed webhook.
```ts
const transport = nodemailer.createTransport({ host: 'localhost', port: 1203 })

export async function sendReceipt(to: string, order: Order) {
  await transport.sendMail({
    from: 'allcsvideos <hello@allcsvideos.test>',
    to,
    subject: `Your receipt: ${order.course}`,
    text: `Thank you! You now own "${order.course}".\n` +
      `Order ${order.id}, paid Rs ${order.amount} (test mode).`,
  })
}
```
Mailpit also has an API, so a test can count the letters: `curl -s localhost:8203/api/v1/messages | grep -o '"total":[0-9]*'`.

### 8. Upload a file

A browser sends a file as `multipart/form-data`: each part has a name, a file name, a type and then its bytes, separated by a random boundary line. On the form (`app/instructor/page.tsx`) you only need `encType="multipart/form-data"` and `<input type="file" name="thumbnail">`. Curl sends the same request (`curl -v` shows `Content-Type: multipart/form-data; boundary=...`).

The handler `app/api/upload/route.ts` calls `req.formData()` and then checks three things, each with its own status: it is a file (400), the type is PNG or JPEG (415), and it is under 1 MB (413). Then it picks the name itself, `crypto.randomUUID()` plus the extension, and writes the bytes into `uploads/`, a folder outside `public`. `app/files/[name]/route.ts` serves a file from that folder (and accepts only names that look like a UUID).

Make a 1.5 MB file for the "too big" test (it is only zero bytes, called `.png`):
```bash
head -c 1500000 /dev/zero > huge.png
curl -s -F thumbnail=@thumb.png localhost:5203/api/upload
curl -s -F thumbnail=@notes.txt localhost:5203/api/upload
curl -s -F thumbnail=@huge.png localhost:5203/api/upload
ls uploads
```
```text
{"url":"/files/8da86b08-47d4-4858-a26e-afbace4f9b73.png","size":66918}
{"error":"only PNG or JPEG"}
{"error":"max 1 MB"}
8da86b08-47d4-4858-a26e-afbace4f9b73.png
```
The file name is different for you. In the browser, open http://localhost:5203/instructor, choose `thumb.png`, press Upload. The answer is a small JSON with the new address and `"size":66918`. Open the page again and the thumbnail shows. The `uploads` folder holds only the good files, with random names.

An honest note: a folder on one server is fine on a laptop. In production, files go to object storage such as Amazon S3. That was not run here.

## Common mistakes

All three are real runs. Each uses a "bad" route that is already in this project. To send a payment to a bad route, use the commands of step 6 with `HOOK=/api/webhooks/bad-parse` (or `HOOK=/api/webhooks/bad-order`) and without the `docker stop` line, then pay it. (Your event numbers may differ.)

1. **Parsing the body before checking the signature** (`bad-parse`). It does `verify(JSON.stringify(event), header)`: a new text made from the object. The provider sent indented text, so the new text has different spaces. Four attempts, four times:
   ```text
   [provider] evt_test_0003 attempt 1 -> 400 {"error":"bad signature"}
   [provider] evt_test_0003 attempt 2 -> 400 {"error":"bad signature"}
   [provider] evt_test_0003 attempt 3 -> 400 {"error":"bad signature"}
   [provider] evt_test_0003 attempt 4 -> 400 {"error":"bad signature"}
   [provider] evt_test_0003 gave up after 4 attempts
   ```
   The order stays `pending`. Always check the raw text.
2. **Marking the event as done first** (`bad-order`). It saves the event id, then sends the email, then marks the order paid. Stop Mailpit (`docker stop m20l03-mail`), pay, start it again (`docker start m20l03-mail`):
   ```text
   [provider] evt_test_0004 attempt 1 -> 500
   [provider] evt_test_0004 attempt 2 -> 200 {"ok":true,"duplicate":true}
   ```
   Attempt 2 is "duplicate": we have seen that id. Nobody ever marks the order paid, so it stays `pending` for ever. Keep the id and the update in one transaction.
3. **Trusting the file name** (`upload-bad`). It saves the file under `file.name`. A caller sends `../hacked.png`:
   ```bash
   curl -s -F "thumbnail=@thumb.png;filename=../hacked.png" localhost:5203/api/upload-bad
   ls hacked.png
   ```
   ```text
   {"saved":"../hacked.png"}
   hacked.png
   ```
   The file was written one folder up, outside `uploads`. With another name it could overwrite your own code. The real handler ignores the name: the same request to `/api/upload` becomes a random UUID inside `uploads`. Delete `hacked.png` afterwards.

## Clean up

```bash
# stop the shop and the provider (Ctrl+C in each terminal), then:
docker rm -f -v m20l03-pg m20l03-mail
rm -rf uploads huge.png hacked.png real.body real.hdr forged.json old.hdr tampered.json provider/last-webhook.json
```
Delete `.env.local`, `node_modules` and `.next` when you are finished.

## Next

[M20-B14 · Build a Full-Stack Course Platform](../m20-b14-build-a-full-stack-course-platform/)

Try it yourself: add a second event type, `payment.refunded`, that sets the order to `refunded`. Resend it twice and check that it happens once.
