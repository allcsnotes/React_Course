// node compile/all.mjs : compiles every file of src with the real plugin and prints every logger event
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url)); const require = createRequire(path.join(HERE, '../package.json'));
const babel = require('@babel/core'); const D = path.join(HERE, '../src');
for (const f of fs.readdirSync(D).filter(x => /\.tsx?$/.test(x))) { const ev = [];
  babel.transformSync(fs.readFileSync(path.join(D, f), 'utf8'), { filename: path.join(D, f), babelrc: false, configFile: false, parserOpts: { plugins: ['jsx', 'typescript'] },
    plugins: [[require.resolve('babel-plugin-react-compiler'), { logger: { logEvent(_, e) { ev.push(e) } } }]] });
  console.log(f.padEnd(20), ev.map(e => e.kind + ':' + (e.fnName || '') + (e.detail ? ' ' + (e.detail.reason || '') : '')).join(' | ') || '(nothing to compile)') }
