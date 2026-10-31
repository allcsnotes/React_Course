// Real measurements: node measure.mjs <label> <url> <runs> <profile>   profile = phone | fast
// phone = 4 Mbit/s down, 100 ms delay, CPU 4x slower. The first load is thrown away; the median of the others is printed.
// Setup once: cd tools && npm install
import fs from 'fs'; import path from 'path'
import { chromium } from 'playwright-core'
const HERE = path.dirname(new URL(import.meta.url).pathname)
const [label, url, runsS, profile] = process.argv.slice(2); const runs = +runsS;
const PROF = { phone: { down: 500000, up: 125000, lat: 100, cpu: 4 }, fast: null }[profile];
const b = await chromium.launch({ channel: 'chrome' });  // your installed Google Chrome
const res = [];
for (let i = 0; i < runs + 1; i++) {
  const ctx = await b.newContext({ viewport: { width: 720, height: 405 } }); const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  if (PROF) { await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: PROF.lat, downloadThroughput: PROF.down, uploadThroughput: PROF.up }); await cdp.send('Emulation.setCPUThrottlingRate', { rate: PROF.cpu }) }
  const reqs = {}; cdp.on('Network.responseReceived', e => { reqs[e.requestId] = { url: e.response.url, type: e.type, status: e.response.status, enc: e.response.headers['content-encoding'] || '' } });
  cdp.on('Network.dataReceived', e => { if (reqs[e.requestId]) reqs[e.requestId].dec = (reqs[e.requestId].dec || 0) + e.dataLength });
  cdp.on('Network.loadingFinished', e => { if (reqs[e.requestId]) reqs[e.requestId].wire = e.encodedDataLength });
  await p.addInitScript(() => {
    window.__m = { firstCourse: null, lcp: 0, fcp: 0 };
    const chk = () => { if (window.__m.firstCourse == null && document.body && /React for Beginners/.test(document.body.innerText || '')) window.__m.firstCourse = performance.now() };
    new MutationObserver(chk).observe(document, { subtree: true, childList: true, characterData: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__m.fcp = e.startTime }).observe({ type: 'paint', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.lcp = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await p.goto(url, { waitUntil: 'load' }); await p.getByText('React for Beginners').first().waitFor(); await p.waitForTimeout(1500);
  const m = await p.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return { ...window.__m, ttfb: n.responseStart, dcl: n.domContentLoadedEventEnd, load: n.loadEventEnd } });
  const html = await p.content(); const all = Object.values(reqs);
  const js = all.filter(r => r.type === 'Script'); const doc = all.find(r => r.type === 'Document');
  const sum = (a, k) => a.reduce((s, r) => s + (r[k] || 0), 0);
  res.push({ ...m, jsCount: js.length, jsWire: sum(js, 'wire'), jsDec: sum(js, 'dec'), docWire: doc.wire, docDec: doc.dec, reqs: all.length, totalWire: sum(all, 'wire'), jsFiles: js.map(r => r.url.split('/').slice(-2).join('/') + ' ' + r.dec), api: all.filter(r => /8191/.test(r.url)).length });
  await ctx.close();
}
await b.close(); res.shift(); // first run = warm-up
const med = k => { const a = res.map(r => r[k]).sort((x, y) => x - y); return a[Math.floor(a.length / 2)] };
const out = { label, url, profile, runs, median: Object.fromEntries(['ttfb', 'fcp', 'firstCourse', 'lcp', 'dcl', 'load', 'jsCount', 'jsWire', 'jsDec', 'docWire', 'docDec', 'reqs', 'totalWire', 'api'].map(k => [k, Math.round(med(k))])), all: res };
fs.mkdirSync(path.join(HERE, 'out'), { recursive: true }); fs.writeFileSync(path.join(HERE, `out/m_${label}_${profile}.json`), JSON.stringify(out, null, 1));
console.log(label, profile, JSON.stringify(out.median)); console.log(res[0].jsFiles.join('\n'));
