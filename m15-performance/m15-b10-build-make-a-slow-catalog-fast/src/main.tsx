import { Profiler, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Catalog } from './Catalog.tsx'
import { onRender } from './perf.ts'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Profiler id="Catalog" onRender={onRender}>
        <Catalog />
      </Profiler>
    </QueryClientProvider>
  </StrictMode>,
)
