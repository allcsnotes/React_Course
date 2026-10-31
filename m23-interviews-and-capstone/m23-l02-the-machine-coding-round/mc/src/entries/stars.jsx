import { createRoot } from 'react-dom/client'
import C from '../StarRating'
import '../style.css'

createRoot(document.getElementById('root')).render(
  <div className="page"><h1>Rate this course</h1><C /></div>,
)
