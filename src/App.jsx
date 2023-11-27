import './index.css'
import Root from './pages/Root'
import Home from './pages/Home'
import Error from './pages/Error'
import FourOFour from './pages/FourOFour'
import Details from './pages/workout/Details'
import Template from './pages/workout/Template'
import Solution from './pages/workout/Solution'
import WorkoutRoot from './pages/workout/WorkoutRoot'
import WorkoutsRoot from './pages/workouts/WorkoutsRoot'
import { loader as workoutLoader } from './pages/workout/WorkoutRoot'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { workoutsLoader } from './pages/workouts/loaders/workoutsLoader'
import { action as editWorkoutAction } from './pages/workout/WorkoutRoot'
import { action as uploadCodeAction } from './components/editor/UploadCodeDialog'

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
        loader: workoutsLoader,
      },
      {
        path: 'workouts/:id',
        element: <WorkoutRoot />,
        errorElement: <Error redirectPath='/workouts' />,
        loader: workoutLoader,
        action: editWorkoutAction,
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
                action: uploadCodeAction,
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
