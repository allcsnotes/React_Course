interface Teacher {
  name: string
  courses: number
}

type Student = {
  name: string
  courses: number
}

const meera: Teacher = { name: 'Meera', courses: 2 }
const lukas: Student = { name: 'Lukas', courses: 1 }
console.log(meera, lukas)
