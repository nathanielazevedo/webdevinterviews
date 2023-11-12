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
          //update local storage for this workouts active tab
          const local = JSON.parse(localStorage.getItem(workout.name))
          if (local) {
            local.activeTab = 'details'
            localStorage.setItem(workout.name, JSON.stringify(local))
          }
          return workout
        },
      },
      {
        path: '/workouts/:workoutName/editor',
        element: <Editor />,
        errorElement: <Error />,
        loader: ({ params }) => {
          const workout = rows.find((row) => row.name === params.workoutName)
          const local = JSON.parse(localStorage.getItem(workout.name))
          if (local) {
            local.activeTab = 'editor'
            localStorage.setItem(workout.name, JSON.stringify(local))
          }
          const files = local ? local.files : workout.template
          return { workout, files, mode: 'template', local }
        },
      },
      {
        path: '/workouts/:workoutName/solution',
        element: <Solution />,
        errorElement: <Error />,
        loader: ({ params }) => {
          const workout = rows.find((row) => row.name === params.workoutName)
          const local = JSON.parse(localStorage.getItem(workout.name))
          if (local) {
            local.activeTab = 'solution'
            localStorage.setItem(workout.name, JSON.stringify(local))
          }
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
