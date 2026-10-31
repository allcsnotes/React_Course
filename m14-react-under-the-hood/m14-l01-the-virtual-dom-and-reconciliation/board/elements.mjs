import { createElement } from 'react'

const hello = createElement(
  'h1',
  { className: 'title' },
  'Hello',
)
console.log(hello)
