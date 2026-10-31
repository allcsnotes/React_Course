import { createBrowserRouter } from 'react-router'
import Layout from './Layout.jsx'
import Home from './Home.jsx'
import CoursesLayout from './CoursesLayout.jsx'
import Courses from './Courses.jsx'
import MyCourses from './MyCourses.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'courses',
        element: <CoursesLayout />,
        children: [{ index: true, element: <Courses /> }],
      },
      { path: 'my-courses', element: <MyCourses /> },
    ],
  },
])
