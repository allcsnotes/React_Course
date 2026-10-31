import { createBrowserRouter } from 'react-router'
import { getCourse, getCourses } from './api'
import RootLayout from './layouts/RootLayout'
import Catalog from './pages/Catalog'
import CourseDetail from './pages/CourseDetail'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    hydrateFallbackElement: <p className="splash">Loading...</p>,
    children: [
      { index: true, element: <Catalog />, loader: getCourses },
      {
        path: 'courses/:slug',
        element: <CourseDetail />,
        loader: ({ params }) => getCourse(params.slug!),
      },
    ],
  },
])

export default router
