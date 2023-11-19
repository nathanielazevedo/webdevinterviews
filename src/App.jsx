import './index.css'
import API from './api'
import Root from './pages/Root'
import Home from './pages/Home'
import Error from './pages/Error'
import FourOFour from './pages/FourOFour'
import WorkoutsRoot from './pages/workouts/WorkoutsRoot'
import Template from './pages/workout/Template'
import Solution from './pages/workout/Solution'
import Details from './pages/workout/Details'
import WorkoutRoot from './pages/workout/WorkoutRoot'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { action as editAction } from './pages/workout/dialogs/SubmitDialog'
import { action as createWorkoutAction } from './pages/workouts/dialogs/CreateDialog'

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
        element: <WorkoutsRoot />,
        errorElement: <Error />,
        action: createWorkoutAction,
        loader: async () => {
          try {
            const workouts = await API.get('/workouts')
            return { workouts }
          } catch (error) {
            console.error(`Failed to load workouts: ${error.message}`)
            throw error
          }
        },
      },
      {
        path: 'workouts/:id',
        element: <WorkoutRoot />,
        errorElement: <Error />,
        loader: async ({ params }) => {
          try {
            const workout = await API.get(`/workouts/${params.id}`)
            workout.solution = JSON.parse(workout.solution)
            workout.template = JSON.parse(workout.template)
            return { workout }
          } catch (error) {
            console.error(`Failed to load workout: ${error.message}`)
            throw error
          }
        },
        children: [
          {
            errorElement: <Error />,
            children: [
              {
                index: true,
                element: <Details />,
                errorElement: <Error />,
              },
              {
                path: 'editor',
                element: <Template />,
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
