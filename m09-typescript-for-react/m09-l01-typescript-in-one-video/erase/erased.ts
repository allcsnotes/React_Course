interface Course {
  title: string
  price: number
}

const course: Course = { title: 'React', price: 499 }

function formatPrice(price: number): string {
  return 'Rs ' + price
}

console.log(formatPrice(course.price))
