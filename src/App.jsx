import './index.css'
import rows from './workouts'
import Error from './pages/Error'
import Home from './pages/Home'
import Root from './pages/Root'
import Editor from './pages/workouts/workout/Editor'
import SecretPlayground from './pages/SecretPlayground'
import Solution from './pages/workouts/workout/Solution'
import WorkoutTable from './pages/workouts/Root'
import Instructions from './pages/workouts/workout/Details'
import EditorRoot from './pages/workouts/workout/Root'
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import FourOFour from './pages/FourOFour'

console.log('rows', rows)

function flattenObject(obj) {
  let result = []

  for (let key in obj) {
    if (
      key === 'workouts' &&
      typeof obj[key] === 'object' &&
      obj[key] !== null
    ) {
      result.push(obj[key])
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      result = result.concat(flattenObject(obj[key]))
    }
  }

  return result
}

function findKeyInObject(obj, keyToFind) {
  if (keyToFind in obj) {
    return obj[keyToFind]
  }

  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const result = findKeyInObject(obj[key], keyToFind)
      if (result !== undefined) {
        return result
      }
    }
  }

  return undefined
}

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
        path: 'workouts/*',
        element: <WorkoutTable />,
        errorElement: <Error />,
        loader: ({ params, request }) => {
          const url = new URL(request.url)
          let d = url.searchParams.get('difficulty')
          if (d == 'all') d = undefined

          const keys = params['*'].split('/')
          let matchingWorkouts

          // returns everything and checks for difficulty filters search params
          if (keys[0] === '') {
            if (d) {
              matchingWorkouts = Object.values(flattenObject(rows)[0]).filter(
                (workout) => workout.difficulty == d
              )
            } else {
              matchingWorkouts = Object.values(flattenObject(rows)[0])
            }
            return { rows: matchingWorkouts, difficulty: d }
          }

          // digging down the path to find whatever
          let currentObject = rows
          for (let key of keys) {
            if (currentObject[key]) {
              currentObject = currentObject[key]
            } else {
              return { rows: [], difficulty: d }
            }
          }

          // if it ends in workouts
          if (currentObject.workouts) {
            if (d) {
              matchingWorkouts = Object.values(currentObject.workouts).filter(
                (workout) => workout.difficulty == d
              )
            } else {
              matchingWorkouts = Object.values(currentObject.workouts)
            }
            return {
              rows: matchingWorkouts,
              difficulty: d,
            }
          } else {
            // it ends not in workouts
            try {
              if (d) {
                matchingWorkouts = Object.values(flattenObject(rows)[0]).filter(
                  (workout) => workout.rating === d
                )
              } else {
                matchingWorkouts = Object.values(flattenObject(rows)[0])
              }
              return {
                rows: matchingWorkouts,
                difficulty: d,
              }
            } catch {
              return { rows: [], difficulty: d }
            }
          }
        },
      },
      {
        path: 'workout/:workoutName/',
        element: <EditorRoot />,
        errorElement: <Error />,
        loader: ({ params }) => {
          const workout = findKeyInObject(rows, params.workoutName)
          if (!workout) {
            return redirect('/workouts')
          }
          return workout
        },
        children: [
          {
            errorElement: <Error />,
            children: [
              {
                index: true,
                element: <Instructions />,
                errorElement: <Error />,
                loader: ({ params }) => {
                  const workout = findKeyInObject(rows, params.workoutName)
                  return workout
                },
              },
              {
                path: 'editor',
                element: <Editor />,
                errorElement: <Error />,
                loader: ({ params }) => {
                  const workout = findKeyInObject(rows, params.workoutName)
                  const local = JSON.parse(localStorage.getItem(workout.name))
                  const files = local ? local.files : workout.template
                  console.log('files', files)
                  return { workout, files, mode: 'template', local }
                },
              },
              {
                path: 'solution',
                element: <Solution />,
                errorElement: <Error />,
                loader: ({ params }) => {
                  const workout = findKeyInObject(rows, params.workoutName)
                  return { workout, files: workout.demo, mode: 'demo' }
                },
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
