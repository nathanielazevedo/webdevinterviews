import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./root/Root";
import Error from "./pages/misc/Error";
import FourOFour from "./pages/misc/FourOFour";
import Contact from "./pages/Contact";

import Workouts from "./pages/workouts/Workouts";
import Workout from "./pages/workout/Workout";
import EditorRoot from "./pages/workout/editor/EditorRoot";

import GamesList from "./pages/games/GamesList";
import GameBase from "./pages/games/components/GameBase.jsx";

import TrueOrFalseMain from "./pages/games/trueOrFalse/TrueOrFalseMain";
import ShortsEditor from "./pages/shortsEditor/ShortsEditor";
import WillItThrowMain from "./pages/games/willItThrow/WillItThrowMain";
import CccMain from "./pages/games/ccc/CccList";
import MutateMain from "./pages/games/mutate/MutateMain";
import ReturnMain from "./pages/games/returns/ReturnMain";
import Runner from "./pages/games/runner/Swimmer2.jsx";
import BattlePage from "./pages/battle/BattlePage";
import BattlePracticeList from "./pages/battle-practice/BattlePracticeList";
import BattlePracticeMode from "./pages/battle-practice/BattlePracticeMode";
import Auth from "./pages/auth/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Quiz from "./pages/courses/multipleChoice/QuizMain.tsx";
import DrillsList from "./pages/drills/DrillsList";
import PythonDrills from "./pages/drills/python/PythonDrills";
import PandasDrills from "./pages/drills/pandas/PandasDrills";

import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ThemeProvider } from "./contexts/ThemeContext";

import App from "./pages/portfolio/App.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <App />,
        errorElement: <Error />,
      },
      {
        path: "shorts-editor",
        errorElement: <Error />,
        element: <ShortsEditor />,
      },
      {
        path: "contact",
        element: <Contact />,
        errorElement: <Error />,
      },
      {
        path: "workouts",
        errorElement: <Error />,
        element: (
          <>
            <Workouts />
          </>
        ),
      },
      {
        path: "workouts/:id",
        element: <Workout />,
        errorElement: <Error />,
        children: [
          {
            errorElement: <Error />,
            children: [
              {
                index: true,
                element: <EditorRoot key="challenge" isSolution={false} />,
                errorElement: <Error />,
              },
              {
                path: "solution",
                element: <EditorRoot key="solution" isSolution={true} />,
                errorElement: <Error />,
              },
              {
                path: "*",
                element: <FourOFour />,
                errorElement: <Error />,
              },
            ],
          },
        ],
      },
      {
        path: "quizes",
        children: [
          {
            index: true,
            element: <Quiz />,
          },
        ],
      },
      {
        path: "drills",
        errorElement: <Error />,
        children: [
          {
            index: true,
            element: <DrillsList />,
          },
          {
            path: "python",
            element: <PythonDrills />,
          },
          {
            path: "pandas",
            element: <PandasDrills />,
          },
        ],
      },
      {
        path: "auth",
        element: <Auth />,
        errorElement: <Error />,
      },
      {
        path: "battle",
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <BattlePage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "battle-practice",
        children: [
          {
            index: true,
            element: <BattlePracticeList />,
          },
          {
            path: ":questionId",
            element: <BattlePracticeMode />,
          },
        ],
      },
      {
        path: "games",
        errorElement: <Error />,
        children: [
          {
            index: true,
            element: (
              <>
                <GamesList />
              </>
            ),
          },
          {
            path: "true-or-false",
            children: [
              {
                index: true,
                element: (
                  <>
                    <TrueOrFalseMain />
                  </>
                ),
              },
              {
                path: "structured/:deckNumber",
                element: <GameBase gameName={"true-or-false"} random={false} />,
              },
              {
                path: "random/:deckNumber",
                element: <GameBase gameName={"true-or-false"} random={true} />,
              },
            ],
          },
          {
            path: "will-it-throw",
            children: [
              {
                index: true,
                element: <WillItThrowMain />,
              },
              {
                path: "structured/:deckNumber",
                element: <GameBase gameName={"will-it-throw"} random={false} />,
              },
              {
                path: "random/:deckNumber",
                element: <GameBase gameName={"will-it-throw"} random={true} />,
              },
            ],
          },
          {
            path: "ccc",
            children: [
              {
                index: true,
                element: <CccMain />,
              },
              {
                path: "random/:deckNumber",
                element: <GameBase gameName={"ccc"} random={true} />,
              },
            ],
          },
          {
            path: "mutate",
            children: [
              {
                index: true,
                element: <MutateMain />,
              },
              {
                path: "random/:deckNumber",
                element: <GameBase gameName={"mutate"} random={true} />,
              },
            ],
          },
          {
            path: "returns",
            children: [
              {
                index: true,
                element: <ReturnMain />,
              },
              {
                path: "random/:deckNumber",
                element: <GameBase gameName={"returns"} random={true} />,
              },
            ],
          },
          {
            path: "runner",
            children: [
              {
                index: true,
                element: <Runner />,
              },
              {
                path: ":id",
                element: (
                  <div className="fit-wrapper">
                    <Runner />
                  </div>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <FourOFour />,
        errorElement: <Error />,
      },
    ],
  },
]);

const Router = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Router;
