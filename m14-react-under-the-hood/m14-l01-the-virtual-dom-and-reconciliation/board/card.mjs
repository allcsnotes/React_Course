import { createElement } from 'react'

function Card({ title }) {
  return createElement('h2', null, title)
}

console.log(createElement(Card, { title: 'React' }))
