import { createBrowserRouter } from 'react-router'
import Layout from './Layout.jsx'
import Home from './Home.jsx'
import CoursesLayout, { loader as userLoader } from './CoursesLayout.jsx'
import Courses, { loader as coursesLoader } from './Courses.jsx'
import MyCourses, { loader as myCoursesLoader } from './MyCourses.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    hydrateFallbackElement: <p className="note">Loading…</p>,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'courses',
        element: <CoursesLayout />,
        loader: userLoader,
        children: [{ index: true, element: <Courses />, loader: coursesLoader }],
      },
      { path: 'my-courses', element: <MyCourses />, loader: myCoursesLoader },
    ],
  },
])
