import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Nav from './Nav.jsx'
import Code from './Code'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import WorkoutGrid from './WorkoutGrid'
// import Home from './Home'
import YouTube from './YouTube'
// import BugBounties from './BugBounties'

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
      // {
      //   path: 'home',
      //   element: <Home />,
      // },
      {
        path: 'youtube',
        element: <YouTube />,
      },
      // {
      //   path: 'bug-bounties',
      //   element: <BugBounties />,
      // },
      {
        path: '*',
        element: <Code />,
      },
    ],
  },
])

// /workouts/react

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
)
