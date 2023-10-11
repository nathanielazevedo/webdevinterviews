import './index.css'
import React from 'react'
import Code from './Code'
import Nav from './Nav.jsx'
import WorkoutGrid from './WorkoutGrid'
import ReactDOM from 'react-dom/client'
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
        element: <Code />,
      },
      {
        path: '*',
        element: <Code />,
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
