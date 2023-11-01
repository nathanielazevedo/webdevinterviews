import './index.css'
import ReactDOM from 'react-dom/client'
import Workout from './workouts/Workout'
import { SnackbarProvider } from 'notistack'
import WorkoutTable from './workouts/WorkoutTable'
import CssBaseline from '@mui/material/CssBaseline'
import { Analytics } from '@vercel/analytics/react'
import SecretPlayground from './components/SecretPlayground'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ClippedDrawer from './components/ClippedNav'
import Home from './pages/Home'

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
    element: <ClippedDrawer />,
    children: [
      {
        path: '/home',
        element: <Home />,
        errorElement: <div>404</div>,
      },
      {
        path: '',
        element: <Home />,
        errorElement: <div>404</div>,
      },
      {
        path: '/workouts?/:filter',
        element: <WorkoutTable />,
        errorElement: <div>404</div>,
      },
      {
        path: '*',
        element: <WorkoutTable />,
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
    <Analytics />
    <SnackbarProvider maxSnack={3}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </SnackbarProvider>
  </>
)
