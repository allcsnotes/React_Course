import { createRoot } from 'react-dom/client'
import './index.css'
import { CartPage } from './CartPage.tsx'
import { ErrorBoundary } from './ErrorBoundary.tsx'
import { startMonitor } from './monitor.ts'

startMonitor()

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <CartPage />
  </ErrorBoundary>,
)
