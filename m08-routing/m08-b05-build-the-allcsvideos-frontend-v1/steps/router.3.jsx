import { createBrowserRouter } from 'react-router'
import { getCourse, getCourses } from './api.js'
import RootLayout from './layouts/RootLayout.jsx'
import CourseLayout from './layouts/CourseLayout.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import CourseDetail from './pages/CourseDetail.jsx'

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
        shouldRevalidate: ({
          currentUrl,
          nextUrl,
        }) =>
          currentUrl.pathname !==
          nextUrl.pathname,
      },
      {
        path: 'courses/:slug',
        element: <CourseLayout />,
        loader: ({ params }) =>
          getCourse(params.slug),
        children: [
          {
            index: true,
            element: <CourseDetail />,
          },
        ],
      },
    ],
  },
])
