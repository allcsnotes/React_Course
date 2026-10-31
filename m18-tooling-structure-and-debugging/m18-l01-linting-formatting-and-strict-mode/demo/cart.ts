export function totalPrice(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}

const found = ['React', 'Python'].find((n) => n.startsWith('Py'))
console.log(found.toUpperCase())

const title = document.getElementById('title')
title.textContent = 'Hello'
