import { createRoot } from 'react-dom/client'
import C from '../Comments'
import '../style.css'

createRoot(document.getElementById('root')).render(
  <div className="page"><C /></div>,
)
