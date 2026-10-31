import { useState } from 'react'
import courses from './data/courses.js'

function CourseRow({ course }) {
  const [saved, setSaved] = useState(false)
  return (
    <li className="row">
      <img src={course.image} alt="" />
      <b>{course.title}</b>
      <input placeholder="notes" />
      <button onClick={() => setSaved(!saved)}>
        {saved ? 'Saved' : 'Save'}
      </button>
    </li>
  )
}

const gitBasics = {
  id: 5, title: 'Git Basics', teacher: 'Asha', lessons: 10,
  price: 0, free: true, image: '/thumbs/git.svg',
}

export default function App() {
  const [list, setList] = useState(courses)

  function addGit() {
    const id = crypto.randomUUID()
    console.log('new id:', id)
    setList([{ ...gitBasics, id }, ...list])
  }

  return (
    <>
      <div className="top">
        <b>allcsvideos</b>
        <button onClick={addGit}>Add Git Basics</button>
      </div>
      <ul>
        {list.map(course => (
          <CourseRow key={course.id} course={course} />
        ))}
      </ul>
    </>
  )
}
