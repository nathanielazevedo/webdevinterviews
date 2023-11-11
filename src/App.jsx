import './index.css'
import Home from './pages/root/Home'
// import EditorEntrance from './pages/EditorEntrance'
import WorkoutTable from './pages/root/WorkoutTable'
import Root from './pages/root/Root'
import SecretPlayground from './pages/SecretPlayground'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Error from './pages/Error'
import { createContext, useState } from 'react'
import Editor from './editors/editor/EditorMain'
import rows from './workouts'
import Instructions from './editors/editor/Instructions'

// const TestRoute = () => <div style={{ color: 'white' }}>test</div>

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
        path: '/workouts/:filter/:workoutName/details',
        element: <Instructions />,
        errorElement: <Error />,
        loader: ({ params }) => {
          console.log(params)
          const workout = rows.find((row) => row.name === params.workoutName)
          return workout
        },
      },
      {
        path: '/workouts/:filter/:workoutName/files',
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
        path: '/workouts/:filter/:workoutName/solution',
        element: <Editor />,
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

export const WorkoutContext = createContext({})

const App = () => {
  const [workoutState, setWorkoutState] = useState({
    showTests: false,
    activeFile: '/App.js',
    visibleFiles: ['/App.js'],
  })

  return (
    <WorkoutContext.Provider value={[workoutState, setWorkoutState]}>
      <RouterProvider router={router} />
    </WorkoutContext.Provider>
  )
}

export default App
