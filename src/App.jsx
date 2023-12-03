import './index.css'
import Root from './pages/Root'
import Home from './pages/Home'
import Error from './pages/Error'
import FourOFour from './pages/FourOFour'
import Details from './pages/workout/Details'
import Template from './pages/workout/Template'
import Solution from './pages/workout/Solution'
import WorkoutRoot from './pages/workout/WorkoutRoot'
import WorkoutsRoot from './pages/workouts/WorkoutsRoot'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import { action as editWorkoutAction } from './pages/workout/WorkoutRoot'
import { action as uploadCodeAction } from './components/editor/UploadCodeDialog'
import Account from './pages/auth/Account'
import VerifyEmail from './pages/auth/VerifyEmail'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import EmailTemplate from './emailTemplate'
import Help from './pages/Help'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <Error />,
      },
      {
        path: 'email-templates',
        element: <EmailTemplate />,
        errorElement: <Error />,
      },
      {
        path: 'help',
        element: <Help />,
        errorElement: <Error />,
      },
      {
        path: 'workouts',
        element: <WorkoutsRoot />,
        errorElement: <Error />,
      },
      {
        path: 'auth',
        errorElement: <Error />,
        children: [
          {
            path: 'login',
            element: <Login />,
            errorElement: <Error />,
          },
          {
            path: 'signup',
            element: <SignUp />,
            errorElement: <Error />,
          },
          {
            path: 'account',
            element: <Account />,
            errorElement: <Error />,
          },
          {
            path: 'verify-email',
            element: <VerifyEmail />,
            errorElement: <Error />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPassword />,
            errorElement: <Error />,
          },
          {
            path: 'reset-password',
            element: <ResetPassword />,
            errorElement: <Error />,
          },
        ],
      },
      {
        path: 'workouts/:id',
        element: <WorkoutRoot />,
        errorElement: <Error redirectPath='/workouts' />,
        action: editWorkoutAction,
        children: [
          {
            errorElement: <Error />,
            children: [
              {
                index: true,
                element: <Details />,
                errorElement: <Error />,
              },
              {
                path: 'editor',
                element: <Template />,
                errorElement: <Error />,
                action: uploadCodeAction,
              },
              {
                path: 'solution',
                element: <Solution />,
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
        path: '*',
        element: <Home />,
        errorElement: <Error />,
      },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
