import { ThemeProvider } from './ThemeContext.tsx'
import { UserProvider } from './UserContext.tsx'
import Page from './Page.tsx'

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Page />
      </UserProvider>
    </ThemeProvider>
  )
}
