import { createRequire } from 'module'; import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url)); const require = createRequire(path.join(HERE, '../package.json')); const babel = require('@babel/core');
const p = path.join(HERE, '../versions/x-skip/App.tsx'); const ev = [];
babel.transformSync(fs.readFileSync(p, 'utf8'), { filename: p, babelrc: false, configFile: false, parserOpts: { plugins: ['jsx', 'typescript'] }, plugins: [[require.resolve('babel-plugin-react-compiler'), { logger: { logEvent(_, e) { ev.push(e) } } }]] });
console.log(JSON.stringify(ev.map(e => ({ kind: e.kind, fn: e.fnName, reason: e.detail && e.detail.reason, description: e.detail && e.detail.description, line: e.detail && e.detail.loc && e.detail.loc.start.line })), null, 1))
