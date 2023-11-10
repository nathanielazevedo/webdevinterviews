import './index.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Home from './pages/root/Home'
import ReactDOM from 'react-dom/client'
import EditorEntrance from './pages/EditorEntrance'
import { SnackbarProvider } from 'notistack'
import WorkoutTable from './pages/root/WorkoutTable'
import Root from './pages/root/Root'
// import { Analytics } from '@vercel/analytics/react'
import SecretPlayground from './pages/SecretPlayground'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import Error from './pages/Error'

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
    element: <Root />,
    children: [
      {
        path: '',
        element: <Home />,
        errorElement: <Error />,
      },
      {
        path: '/workouts?/:filter',
        element: <WorkoutTable />,
        errorElement: <div>Sorry, I have a bug.</div>,
      },
      {
        path: '*',
        element: <Home />,
        errorElement: <div>Sorry, I have a bug.</div>,
      },
    ],
  },
  {
    path: 'workouts/:filter/:name',
    element: <EditorEntrance />,
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
