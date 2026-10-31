// node compile/run.mjs <file> : runs the real babel-plugin-react-compiler on one file; prints the output and every logger event
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url)); const require = createRequire(path.join(HERE, '../package.json'));
const babel = require('@babel/core'); const f = process.argv[2]; const src = fs.readFileSync(path.join(HERE, f), 'utf8'); const events = [];
const r = babel.transformSync(src, { filename: path.join(HERE, f), babelrc: false, configFile: false, parserOpts: { plugins: ['jsx'] },
  plugins: [[require.resolve('babel-plugin-react-compiler'), { logger: { logEvent(file, e) { events.push(e) } } }]] });
console.log(r.code); console.log('--- events'); for (const e of events) console.log(e.kind, e.fnName || '', (e.detail && (e.detail.reason || (e.detail.options && e.detail.options.reason))) || '', e.detail && e.detail.options ? JSON.stringify(e.detail.options).slice(0, 400) : '');
