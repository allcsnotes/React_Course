import http from 'node:http';
import fs from 'node:fs';
import { WebSocketServer } from 'ws';

const FILE = new URL('./notes.json', import.meta.url);
let notes = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : [];
const sse = new Set();
const log = (...a) => console.log(new Date().toTimeString().slice(0, 8), ...a);
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type' };

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
  if (url.pathname === '/notifications') {
    const after = Number(url.searchParams.get('after') || 0);
    const fresh = notes.filter((n) => n.id > after);
    log(`GET /notifications?after=${after} -> ${fresh.length} new`);
    res.writeHead(200, { ...cors, 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(fresh));
  }
  if (url.pathname === '/events') {
    res.writeHead(200, {
      ...cors,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    });
    res.write('retry: 1000\n\n');
    sse.add(res);
    log(`sse open (${sse.size} open, last id ${req.headers['last-event-id'] ?? 'none'})`);
    req.on('close', () => { sse.delete(res); log(`sse closed (${sse.size} open)`); });
    return;
  }
  if (url.pathname === '/publish' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      const note = publish(JSON.parse(body).title);
      res.writeHead(200, { ...cors, 'Content-Type': 'application/json' });
      res.end(JSON.stringify(note));
    });
    return;
  }
  if (url.pathname === '/stats') {
    res.writeHead(200, { ...cors, 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ sse: sse.size, ws: wss.clients.size }));
  }
  res.writeHead(404, cors);
  res.end();
});

const wss = new WebSocketServer({ server, path: '/ws' });
wss.on('connection', (ws) => {
  log(`ws connected (${wss.clients.size} open)`);
  ws.on('message', (raw) => {
    const msg = JSON.parse(raw);
    log(`ws got ${raw}`);
    if (msg.type === 'read') ws.send(JSON.stringify({ type: 'ack', id: msg.id }));
  });
  ws.on('close', () => log(`ws closed (${wss.clients.size} open)`));
});

function publish(title) {
  const note = { id: (notes[0]?.id ?? 0) + 1, title, by: 'Meera', at: new Date().toISOString() };
  notes = [note, ...notes];
  fs.writeFileSync(FILE, JSON.stringify(notes));
  for (const res of sse) res.write(`id: ${note.id}\ndata: ${JSON.stringify(note)}\n\n`);
  for (const ws of wss.clients) ws.send(JSON.stringify({ type: 'notification', note }));
  log(`publish #${note.id} -> ${sse.size} sse, ${wss.clients.size} ws`);
  return note;
}

server.listen(8221, () => log('listening on 8221'));
