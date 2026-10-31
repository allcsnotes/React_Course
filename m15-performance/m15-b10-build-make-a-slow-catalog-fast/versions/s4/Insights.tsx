import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Course } from './api.ts'

export default function Insights({ courses }: { courses: Course[] }) {
  const counts = new Map<string, number>()
  for (const c of courses)
    counts.set(c.category, (counts.get(c.category) ?? 0) + 1)
  const data = [...counts].map(([category, total]) => ({
    category,
    total,
  }))
  return (
    <section className="insights">
      <h2>Courses per category</h2>
      <BarChart width={520} height={150} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#1a7cff" isAnimationActive={false} />
      </BarChart>
    </section>
  )
}
