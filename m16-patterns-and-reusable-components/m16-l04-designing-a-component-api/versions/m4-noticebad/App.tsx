import { Notice } from './Notice.tsx'

export default function App() {
  return (
    <main>
      <Notice dismissible>Only 3 seats left.</Notice>
      <Notice onDismiss={() => {}}>Only 3 seats left.</Notice>
    </main>
  )
}
