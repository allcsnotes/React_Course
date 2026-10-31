export type Course = { id: number; title: string; topic: string; hours: number; rating: number }

const TOPICS = ['Python', 'JavaScript', 'React', 'SQL', 'Docker', 'Git', 'Java', 'Linux', 'Node', 'Rust', 'Kotlin', 'Go']
const ANGLES = ['Basics', 'Projects', 'Interview Prep', 'Deep Dive', 'Crash Course', 'Practice', 'Tips', 'Workshop', 'Patterns', 'Tools']

export const COURSES: Course[] = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  title: `${TOPICS[i % 12]} ${ANGLES[(i * 7) % 10]} ${i + 1}`,
  topic: TOPICS[i % 12],
  hours: 2 + ((i * 5) % 17),
  rating: 3 + ((i * 3) % 3),
}))
