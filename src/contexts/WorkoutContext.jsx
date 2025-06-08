import { createContext, useState } from "react";
import { useParams } from "react-router-dom";
import workouts from "../pages/workouts/workouts.json";

const WorkoutContext = createContext();

const WorkoutProvider = ({ children }) => {
  const params = useParams();
  const [fromLocal, setFromLocal] = useState(false);
  const workout = workouts.find((w) => w.id == params.id);

  return (
    <WorkoutContext.Provider value={{ workout, fromLocal, setFromLocal }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export { WorkoutContext, WorkoutProvider };
