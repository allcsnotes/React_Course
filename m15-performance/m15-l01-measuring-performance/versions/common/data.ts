export type Course = {
  id: number
  title: string
  teacher: string
  price: number
}

const topics = ['React', 'Python', 'SQL', 'DevOps', 'Docker', 'Java', 'Git', 'Linux', 'Node', 'AWS']
const kinds = ['for Beginners', 'in Two Weeks', 'Crash Course', 'Masterclass', 'Interview Prep', 'Projects']
const teachers = ['Meera', 'Asha']

export const courses: Course[] = Array.from({ length: 8000 }, (_, i) => ({
  id: i + 1,
  title: `${topics[i % topics.length]} ${kinds[Math.floor(i / topics.length) % kinds.length]} ${Math.floor(i / 60) + 1}`,
  teacher: teachers[i % 2],
  price: (i % 7) * 100 + 99,
}))
