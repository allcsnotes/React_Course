import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
const count = 0
console.log(renderToStaticMarkup(h('div', null, count && h('b', null, 'sale'))))
console.log(renderToStaticMarkup(h('div', null, count > 0 && h('b', null, 'sale'))))
