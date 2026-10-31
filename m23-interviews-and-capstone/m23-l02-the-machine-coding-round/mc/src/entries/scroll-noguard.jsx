import { createRoot } from 'react-dom/client'
import C from '../bad/InfiniteNoGuard'
import '../style.css'

createRoot(document.getElementById('root')).render(
  <div className=""><C /></div>,
)
