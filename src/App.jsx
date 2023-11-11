import './index.css'
import rows from './workouts'
import Error from './pages/Error'
import Home from './pages/Home'
import Root from './pages/Root'
import Editor from './pages/workouts/workout/Editor'
import SecretPlayground from './pages/SecretPlayground'
import Solution from './pages/workouts/workout/Solution'
import WorkoutTable from './pages/workouts/WorkoutTable'
import Instructions from './pages/workouts/workout/Details'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <Home />,
        errorElement: <Error />,
      },
      {
        path: '/workouts',
        element: <WorkoutTable />,
        errorElement: <Error />,
      },
      {
        path: '/workouts/:filter',
        element: <WorkoutTable />,
        errorElement: <Error />,
      },
      {
        path: '/workouts/:workoutName/details',
        element: <Instructions />,
        errorElement: <Error />,
        loader: ({ params }) => {
          const workout = rows.find((row) => row.name === params.workoutName)
          return workout
        },
      },
      {
        path: '/workouts/:workoutName/editor',
        element: <Editor />,
        errorElement: <Error />,
        loader: ({ params }) => {
          const workout = rows.find((row) => row.name === params.workoutName)
          const localFiles = JSON.parse(localStorage.getItem(workout.name))
          const files = localFiles ? localFiles : workout.template
          return { workout, files, mode: 'template' }
        },
      },
      {
        path: '/workouts/:workoutName/solution',
        element: <Solution />,
        errorElement: <Error />,
        loader: ({ params }) => {
          const workout = rows.find((row) => row.name === params.workoutName)
          return { workout, files: workout.demo, mode: 'demo' }
        },
      },
      {
        path: '/secretplayground',
        element: <SecretPlayground />,
        errorElement: <Error />,
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
