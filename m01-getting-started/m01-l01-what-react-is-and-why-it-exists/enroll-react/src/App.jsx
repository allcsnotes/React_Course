import { useState } from 'react'
import './App.css'

function Header({ myCourses }) {
  return (
    <header>
      <b className="logo">allcsvideos</b>
      <span className="badge">My courses <b>{myCourses}</b></span>
    </header>
  )
}

function CourseCard({ enrolled, onEnroll }) {
  return (
    <div className="course">
      <div className="thumb">React</div>
      <h2>React for Beginners</h2>
      <p>by Meera</p>
      <p>{enrolled ? 1205 : 1204} students</p>
      <button onClick={onEnroll}>
        {enrolled ? 'Enrolled' : 'Enroll'}
      </button>
    </div>
  )
}

export default function App() {
  const [enrolled, setEnrolled] = useState(false)
  return (
    <>
      <Header myCourses={enrolled ? 4 : 3} />
      <CourseCard
        enrolled={enrolled}
        onEnroll={() => setEnrolled(true)}
      />
    </>
  )
}
