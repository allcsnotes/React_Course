import { createBrowserRouter } from 'react-router'
import RootLayout from './RootLayout.jsx'
import Home from './Home.jsx'
import Catalog from './Catalog.jsx'
import About from './About.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'about', element: <About /> },
    ],
  },
])
