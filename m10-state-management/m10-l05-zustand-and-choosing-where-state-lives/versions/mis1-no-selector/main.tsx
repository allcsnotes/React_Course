import { createRoot } from 'react-dom/client'
import './index.css'
import ContextShop from './ContextShop.tsx'
import ZustandShop from './ZustandShop.tsx'

// the address picks the page: ?store=context or ?store=zustand
const store = new URLSearchParams(location.search).get('store')

createRoot(document.getElementById('root')!).render(
  store === 'context' ? <ContextShop /> : <ZustandShop />,
)
