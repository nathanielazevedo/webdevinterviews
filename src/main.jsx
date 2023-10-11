import './index.css'
import React from 'react'
import Nav from './components/Nav'
import Workout from './workouts/Workout'
import ReactDOM from 'react-dom/client'
import WorkoutGrid from './workouts/WorkoutsMain'
import { Analytics } from '@vercel/analytics/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

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
      },
      {
        path: '/workouts?/:filter',
        element: <WorkoutGrid />,
      },
      {
        path: 'workouts/:filter/:name',
        element: <Workout />,
      },
      {
        path: '*',
        element: <WorkoutGrid />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Analytics />
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
)
