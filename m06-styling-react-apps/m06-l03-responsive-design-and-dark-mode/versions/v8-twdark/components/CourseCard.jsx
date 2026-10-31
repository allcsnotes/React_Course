import Tag from './Tag'
import formatPrice from '../utils/formatPrice'

function CourseCard({ course }) {
  return (
    <div className="relative rounded-2xl border
      border-slate-200 bg-white p-3
      dark:border-slate-700 dark:bg-slate-900">
      {course.free && <Tag text="FREE" />}
      <img src={course.image} alt="" className="w-14" />
      <h3 className="my-1.5 text-2xl font-bold">{course.title}</h3>
      <p className="my-1 text-slate-600 dark:text-slate-400">by {course.teacher}</p>
      <p className="my-1 text-slate-600 dark:text-slate-400">{course.lessons} lessons</p>
      <p className="my-1 text-slate-600 dark:text-slate-400">{formatPrice(course.price)}</p>
    </div>
  )
}

export default CourseCard
