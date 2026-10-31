import Header from './Header.tsx'
import Renders from './Renders.tsx'
import CourseList from './CourseList.tsx'
import Footer from './Footer.tsx'
import type { Theme, User } from './types.ts'

type Props = { theme: Theme; user: User; onToggleTheme: () => void }

export default function Page({ theme, user, onToggleTheme }: Props) {
  return (
    <main>
      <Renders name="Page" />
      <Header theme={theme} user={user} onToggleTheme={onToggleTheme} />
      <CourseList theme={theme} user={user} />
      <Footer />
    </main>
  )
}
