const course = { id: 1, title: 'React for Beginners' }

const text = JSON.stringify(course)
console.log(text)
console.log(typeof text)

const back = JSON.parse(text)
console.log(back.title)
