import { createRequire } from 'module'; import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url)); const require = createRequire(path.join(HERE, '../package.json')); const babel = require('@babel/core');
for (const [f, extra] of [['Badge.jsx', 'annotation'], ['BadgeUse.jsx', 'annotation']]) { const p = path.join(HERE, f); const r = babel.transformSync(fs.readFileSync(p, 'utf8'), { filename: p, babelrc: false, configFile: false, parserOpts: { plugins: ['jsx'] }, plugins: [[require.resolve('babel-plugin-react-compiler'), { compilationMode: extra }]] });
  console.log(f, extra, '-> compiled:', r.code.includes('compiler-runtime')) }
