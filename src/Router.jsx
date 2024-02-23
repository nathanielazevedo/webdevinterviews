import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './root/Root'

import Home from './pages/Home'
import Error from './pages/misc/Error'
import FourOFour from './pages/misc/FourOFour'
import Contact from './pages/Contact'

import Workouts from './pages/workouts/Workouts'
import Workout from './pages/workout/Workout'
import EditorRoot from './pages/workout/editor/EditorRoot'

import GamesList from './pages/games/GamesList'
import TrueOrFalseList from './pages/games/trueOrFalse/TrueOrFalseList'
import TrueOrFalse from './pages/games/trueOrFalse/TrueOrFalse'
import ShortsEditor from './pages/shortsEditor/ShortsEditor'
import WillItThrowList from './pages/games/willItThrow/WillItThrowList'
import WillItThrow from './pages/games/willItThrow/Will_ItThrow'
import Contests from './pages/contests/ContestsList'
import NewMemberForm from './pages/NewMemberForm'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <Error />,
      },
      {
        path: 'new-member',
        element: <NewMemberForm />,
      },
      {
        path: 'shorts-editor',
        errorElement: <Error />,
        element: <ShortsEditor />,
      },
      {
        path: 'contact',
        element: <Contact />,
        errorElement: <Error />,
      },
      {
        path: 'workouts',
        errorElement: <Error />,
        element: <Workouts />,
      },
      {
        path: 'workouts/:id',
        element: <Workout />,
        errorElement: <Error />,
        children: [
          {
            errorElement: <Error />,
            children: [
              {
                index: true,
                element: <EditorRoot key='challenge' isSolution={false} />,
                errorElement: <Error />,
              },
              {
                path: 'solution',
                element: <EditorRoot key='solution' isSolution={true} />,
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
        path: 'games',
        children: [
          {
            index: true,
            element: <GamesList />,
          },
          {
            path: 'true-or-false',
            children: [
              {
                index: true,
                element: <TrueOrFalseList />,
              },
              {
                path: ':id',
                element: (
                  <div className='fit-wrapper'>
                    <TrueOrFalse />
                  </div>
                ),
              },
            ],
          },
          {
            path: 'will-it-throw',
            children: [
              {
                index: true,
                element: <WillItThrowList />,
              },
              {
                path: ':id',
                element: <WillItThrow />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <FourOFour />,
        errorElement: <Error />,
      },
    ],
  },
])

const Router = () => <RouterProvider router={router} />

export default Router
