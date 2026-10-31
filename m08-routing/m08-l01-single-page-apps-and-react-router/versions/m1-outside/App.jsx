import { useState } from 'react'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { Link } from 'react-router'
import Home from './Home.jsx'
import Catalog from './Catalog.jsx'
import './App.css'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/catalog', element: <Catalog /> },
])

export default function App() {
  const [saved, setSaved] = useState(0)

  return (
    <>
      <header>
        <b className="logo">allcsvideos</b>
        <Link to="/">Home</Link>
        <span className="saved">Saved: {saved}</span>
        <button onClick={() => setSaved(saved + 1)}>
          + Save
        </button>
      </header>
      <RouterProvider router={router} />
    </>
  )
}
