import './index.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Home from './pages/Home'
import ReactDOM from 'react-dom/client'
import Workout from './workouts/Workout'
import { SnackbarProvider } from 'notistack'
import WorkoutTable from './pages/WorkoutTable'
import Frame from './components/frame/Frame'
// import { Analytics } from '@vercel/analytics/react'
import SecretPlayground from './pages/SecretPlayground'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'

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
    element: <Frame />,
    children: [
      {
        path: '/home',
        element: <Home />,
        errorElement: <div>Sorry, I have a bug.</div>,
      },
      {
        path: '',
        element: <Home />,
        errorElement: <div>Sorry, I have a bug.</div>,
      },
      {
        path: '/workouts?/:filter',
        element: <WorkoutTable />,
        errorElement: <div>Sorry, I have a bug.</div>,
      },
      {
        path: '*',
        element: <WorkoutTable />,
        errorElement: <div>Sorry, I have a bug.</div>,
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
