import './index.css'
import Nav from './components/Nav'
import Workout from './workouts/Workout'
import ReactDOM from 'react-dom/client'
import WorkoutGrid from './workouts/WorkoutsGrid'
import { Analytics } from '@vercel/analytics/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SecretPlayground from './components/SecretPlayground'
import { SnackbarProvider } from 'notistack'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#19e4ff',
    },
  },

  typography: {
    fontFamily: 'Bai Jamjuree',
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <Nav />,
    children: [
      {
        path: '',
        element: <WorkoutGrid />,
        errorElement: <div>404</div>,
      },
      {
        path: '/workouts?/:filter',
        element: <WorkoutGrid />,
        errorElement: <div>404</div>,
      },
      {
        path: '*',
        element: <WorkoutGrid />,
        errorElement: <div>404</div>,
      },
    ],
  },
  {
    path: 'workouts/:filter/:name',
    element: <Workout />,
    errorElement: <div>404</div>,
  },
  {
    path: '/secretplayground',
    element: <SecretPlayground />,
    errorElement: <div>404</div>,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    {/* <Analytics /> */}
    <SnackbarProvider maxSnack={3}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </SnackbarProvider>
  </>
)
