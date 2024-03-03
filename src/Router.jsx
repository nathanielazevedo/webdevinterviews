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
import GameBase from './pages/games/components/GameBase.jsx'

import TrueOrFalseMain from './pages/games/trueOrFalse/TrueOrFalseMain'
import ShortsEditor from './pages/shortsEditor/ShortsEditor'
import WillItThrowMain from './pages/games/willItThrow/WillItThrowMain'
import NewMemberForm from './pages/NewMemberForm'
import Ccc from './pages/games/ccc/Ccc'
import CccList from './pages/games/ccc/CccList'

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
                element: <TrueOrFalseMain />,
              },
              {
                path: 'structured/:deckNumber',
                element: <GameBase gameName={'true-or-false'} random={false} />,
              },
              {
                path: 'random/:deckNumber',
                element: <GameBase gameName={'true-or-false'} random={true} />,
              },
            ],
          },
          {
            path: 'will-it-throw',
            children: [
              {
                index: true,
                element: <WillItThrowMain />,
              },
              {
                path: 'structured/:deckNumber',
                element: <GameBase gameName={'will-it-throw'} random={false} />,
              },
              {
                path: 'random/:deckNumber',
                element: <GameBase gameName={'will-it-throw'} random={false} />,
              },
            ],
          },
          {
            path: 'ccc',
            children: [
              {
                index: true,
                element: <CccList />,
              },
              {
                path: ':id',
                element: (
                  <div className='fit-wrapper'>
                    <Ccc />
                  </div>
                ),
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
