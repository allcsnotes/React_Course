import { createBrowserRouter } from 'react-router'
import RootLayout from './RootLayout.jsx'
import Home from './Home.jsx'
import Catalog from './Catalog.jsx'
import About from './About.jsx'
import CourseLayout from './CourseLayout.jsx'
import Lesson from './Lesson.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'catalog', element: <Catalog /> },
      {
        path: 'courses/:slug',
        element: <CourseLayout />,
        children: [
          {
            path: 'lessons/:lessonId',
            element: <Lesson />,
          },
        ],
      },
      { path: 'about', element: <About /> },
    ],
  },
])
