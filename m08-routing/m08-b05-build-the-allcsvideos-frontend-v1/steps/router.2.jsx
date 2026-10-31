import { createBrowserRouter } from 'react-router'
import { getCourses } from './api.js'
import RootLayout from './layouts/RootLayout.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'

export default createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: getCourses,
      },
      {
        path: 'catalog',
        element: <Catalog />,
        loader: getCourses,
      },
    ],
  },
])
