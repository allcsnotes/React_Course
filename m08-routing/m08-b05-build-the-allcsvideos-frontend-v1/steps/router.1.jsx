import { createBrowserRouter } from 'react-router'
import { getCourses } from './api.js'
import RootLayout from './layouts/RootLayout.jsx'
import Home from './pages/Home.jsx'

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
    ],
  },
])
