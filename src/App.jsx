import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './pages/Root'
import Home from './pages/Home'
import Error from './pages/misc/Error'
import FourOFour from './pages/misc/FourOFour'
import Template from './pages/workout/Template'
import Solution from './pages/workout/Solution'
import MyWorkouts from './pages/workouts/my-workouts/MyWorkouts'
import WorkoutsRoot from './pages/workouts/root/WorkoutsRoot'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/Signup'
import Account from './pages/auth/Account'
import VerifyEmail from './pages/auth/VerifyEmail'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Help from './pages/misc/Help'
import EditWorkout from './pages/workout/EditWorkout'
import WorkoutsTable from './pages/workouts/table/WorkoutsTable'
import ManageCode from './pages/workout/manage/ManageCode'
import ManageRoot from './pages/workout/manage/ManageRoot'
import WorkoutRoot from './pages/workout/root/WorkoutRoot'
import RootRedirect from './components/RootRedirect'

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
        path: 'help',
        element: <Help />,
        errorElement: <Error />,
      },
      {
        path: 'workouts',
        errorElement: <Error />,
        element: <WorkoutsRoot />,
        children: [
          {
            index: true,
            element: <RootRedirect />,
          },
          {
            path: 'official',
            element: <WorkoutsTable tab='official' />,
          },
          {
            path: 'community',
            element: <WorkoutsTable tab='community' />,
          },
          {
            path: 'your-workouts',
            element: <MyWorkouts />,
          },
        ],
      },
      {
        path: 'workouts/:id',
        element: <WorkoutRoot />,
        errorElement: <Error redirectPath='/workouts' />,
        children: [
          {
            errorElement: <Error />,
            children: [
              {
                index: true,
                element: <Template />,
                errorElement: <Error />,
              },
              {
                path: 'solution',
                element: <Solution />,
                errorElement: <Error />,
              },
              {
                path: 'manage',
                element: <ManageRoot />,
                errorElement: <Error />,
                children: [
                  {
                    path: '',
                    element: <EditWorkout />,
                    errorElement: <Error />,
                  },
                  {
                    path: 'code',
                    element: <ManageCode />,
                    errorElement: <Error />,
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

const App = () => <RouterProvider router={router} />

export default App
