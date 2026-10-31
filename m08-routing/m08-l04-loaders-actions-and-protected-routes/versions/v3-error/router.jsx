import { createBrowserRouter } from 'react-router'
import Layout from './Layout.jsx'
import Home from './Home.jsx'
import ErrorPage from './ErrorPage.jsx'
import Courses, { loader as coursesLoader } from './Courses.jsx'
import MyCourses, { loader as myCoursesLoader } from './MyCourses.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    hydrateFallbackElement: (
      <p className="note">Loading…</p>
    ),
    children: [
      { index: true, element: <Home /> },
      {
        path: 'courses',
        element: <Courses />,
        loader: coursesLoader,
        errorElement: <ErrorPage />,
      },
      { path: 'my-courses', element: <MyCourses />, loader: myCoursesLoader },
    ],
  },
])
