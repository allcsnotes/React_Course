import Header from './Header.tsx'
import CourseList from './CourseList.tsx'
import Footer from './Footer.tsx'
import type { Lang, Theme, User } from './types.ts'

type Props = { theme: Theme; user: User; lang: Lang; onToggleTheme: () => void }

export default function Page({ theme, user, lang, onToggleTheme }: Props) {
  return (
    <main>
      <Header theme={theme} user={user} onToggleTheme={onToggleTheme} />
      <CourseList theme={theme} user={user} lang={lang} />
      <Footer />
    </main>
  )
}
