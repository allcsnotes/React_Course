import { createRoot } from 'react-dom/client'
import C from '../bad/AutocompleteNaive'
import '../style.css'

createRoot(document.getElementById('root')).render(
  <div className="page"><h1>Course search</h1><C /></div>,
)
