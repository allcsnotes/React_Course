import { transformSync } from 'esbuild'; import fs from 'fs'; import { createElement } from 'react'; import { renderToStaticMarkup } from 'react-dom/server';
const code = transformSync(fs.readFileSync('Card.jsx', 'utf8'), { loader: 'jsx', format: 'esm', jsx: 'automatic' }).code;
fs.writeFileSync('Card.mjs', code);
const { default: CourseCard } = await import('./Card.mjs'); console.log(renderToStaticMarkup(createElement(CourseCard)));
