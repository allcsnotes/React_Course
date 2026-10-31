import { AppProvider } from './AppContext.tsx'
import Page from './Page.tsx'
import './counters.css'

export default function App() {
  return (
    <AppProvider>
      <Page />
    </AppProvider>
  )
}
