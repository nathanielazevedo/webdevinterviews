import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './pages/Root'
import Home from './pages/Home'
import Error from './pages/misc/Error'
import FourOFour from './pages/misc/FourOFour'
import Template from './pages/workout/Template'
import Solution from './pages/workout/Solution'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/Signup'
import Account from './pages/auth/Account'
import VerifyEmail from './pages/auth/VerifyEmail'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Help from './pages/misc/Help'
import EditWorkout from './pages/workout/manage/EditWorkout'
import WorkoutsTable from './pages/workouts/table/WorkoutsTable'
import ManageRoot from './pages/workout/manage/ManageRoot'
import WorkoutRoot from './pages/workout/root/WorkoutRoot'
import RootRedirect from './components/RootRedirect'
import Games from './pages/games/GamesTable'
import TrueOrFalseList from './pages/games/trueOrFalse/TrueOrFalseList'
import TrueOrFalse from './pages/games/trueOrFalse/TrueOrFalse'
import ShortsEditor from './pages/shortsEditor/ShortsEditor'
import WillItThrowList from './pages/games/willItThrow/WillItThrowList'
import WillItThrow from './pages/games/willItThrow/Will_ItThrow'

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
        path: 'shorts-editor',
        errorElement: <Error />,
        element: <ShortsEditor />,
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
        element: <WorkoutsTable />,
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
        path: 'games',
        // errorElement: <Error />,
        children: [
          {
            index: true,
            element: <Games />,
          },
          {
            path: 'true-or-false',
            children: [
              {
                index: true,
                element: <TrueOrFalseList />,
              },
              {
                path: ':id',
                element: <TrueOrFalse />,
              },
            ],
          },
          {
            path: 'will-it-throw',
            children: [
              {
                index: true,
                element: <WillItThrowList />,
              },
              {
                path: ':id',
                element: <WillItThrow />,
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
