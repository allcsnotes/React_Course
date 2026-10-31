import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { useCartStore } from './cart/cartStore'
import router from './router'
import './index.css'

window.addEventListener('storage', (e) => {
  if (e.key === 'cart') useCartStore.persist.rehydrate()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
