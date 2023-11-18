import './index.css'
import Root from './pages/Root'
import Home from './pages/Home'
import Error from './pages/Error'
import FourOFour from './pages/FourOFour'
import WorkoutTable from './pages/workouts/Root'
import Editor from './pages/workouts/workout/Editor'
import EditorRoot from './pages/workouts/workout/Root'
import Solution from './pages/workouts/workout/Solution'
import Instructions from './pages/workouts/workout/Details'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { action as editAction } from './components/editor/SubmitDialog'
import API from './api'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <Error />,
      },
      {
        path: 'workouts',
        element: <WorkoutTable />,
        errorElement: <Error />,
        loader: async () => {
          const workouts = await API.get('/workouts')
          return { workouts, difficulty: '2' }
        },
      },
      {
        path: 'workouts/:id',
        element: <EditorRoot />,
        errorElement: <Error />,
        loader: async ({ params }) => {
          const workout = await API.get(`/workouts/${params.id}`)
          return { workout, difficulty: '2' }
        },
        children: [
          {
            errorElement: <Error />,
            children: [
              {
                index: true,
                element: <Instructions />,
                errorElement: <Error />,
              },
              {
                path: 'editor',
                element: <Editor />,
                errorElement: <Error />,
                action: editAction,
              },
              {
                path: 'solution',
                element: <Solution />,
                errorElement: <Error />,
              },
              {
                path: '*',
                element: <FourOFour />,
                errorElement: <Error />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <Home />,
        errorElement: <Error />,
      },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
