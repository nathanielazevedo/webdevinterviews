import * as React from 'react'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './root/Root'
import Footer from './components/Footer.jsx'
import Home from './pages/home/Home'
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
import CccMain from './pages/games/ccc/CccList'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { AuthProvider } from './contexts/AuthContext'

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
        element: (
          <>
            <Workouts />
            <Footer />
          </>
        ),
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
            element: (
              <>
                <GamesList />
                <Footer />
              </>
            ),
          },
          {
            path: 'true-or-false',
            children: [
              {
                index: true,
                element: (
                  <>
                    <TrueOrFalseMain />
                    <Footer />
                  </>
                ),
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
                element: <GameBase gameName={'will-it-throw'} random={true} />,
              },
            ],
          },
          {
            path: 'ccc',
            children: [
              {
                index: true,
                element: <CccMain />,
              },
              {
                path: 'random/:deckNumber',
                element: <GameBase gameName={'ccc'} random={true} />,
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

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
})

const getTheme = () => {
  const theme = localStorage.getItem('theme')
  if (theme) {
    return theme
  } else {
    return 'dark'
  }
}

const Router = () => {
  const [mode, setMode] = React.useState(getTheme())
  const colorMode = {
    toggleColorMode: () => {
      setMode((prevMode) => {
        const newMode = prevMode === 'light' ? 'dark' : 'light'
        localStorage.setItem('theme', newMode)
        return newMode
      })
    },
    mode,
  }

  let theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  )
  theme = responsiveFontSizes(theme)
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default Router
