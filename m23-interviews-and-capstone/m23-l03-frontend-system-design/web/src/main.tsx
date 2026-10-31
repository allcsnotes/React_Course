import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import Feed from './Feed.tsx'
import Watch from './Watch.tsx'
import Dashboard from './Dashboard.tsx'
import FeedOffset from './FeedOffset.tsx'

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
const page = location.pathname.split('/')[1]

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {page === 'watch' ? <Watch /> : page === 'dashboard' ? <Dashboard /> : page === 'offset' ? <FeedOffset /> : <Feed />}
    </QueryClientProvider>
  </StrictMode>,
)
