import Header from './Header.tsx'
import CourseList from './CourseList.tsx'
import Footer from './Footer.tsx'
import type { Theme, User } from './App.tsx'

type Props = {
  theme: Theme
  setTheme: (t: Theme) => void
  user: User | null
  setUser: (u: User | null) => void
}

export default function Page(p: Props) {
  return (
    <>
      <Header {...p} />
      <CourseList theme={p.theme} user={p.user} />
      <Footer />
    </>
  )
}
