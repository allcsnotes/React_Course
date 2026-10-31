import CourseBox from './CourseBox.jsx'

export default function App() {
  return (
    <div className="page">
      <CourseBox
        title="Python from Zero"
        subtitle="by Meera"
        badgeText="Free"
        showBadge={true}
        buttonText="Enroll"
        showButton={true}
        note="20 lessons"
      />
    </div>
  )
}
