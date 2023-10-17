/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useContext } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'
import { setLocalStorage } from './utils'
import { WorkoutContext } from '../workouts/Workout'
import { RenderCounter } from '../components/RenderCount'

const AutoSave = ({ autoSave, manuallySaved, setManuallySaved }) => {
  const { sandpack } = useSandpack()
  const { files } = sandpack
  // const [workoutState, setWorkoutState] = useContext(WorkoutContext)

  // useEffect(() => {
  //   if (autoSave) {
  //     setLocalStorage(workoutState.challenge, files, workoutState.showDemo)
  //     setWorkoutState((prevState) => ({
  //       ...prevState,
  //       saved: true,
  //       files: files,
  //     }))
  //     setManuallySaved(false)
  //     sandpack.runSandpack()
  //   } else if (manuallySaved) {
  //     setManuallySaved(false)
  //     sandpack.runSandpack()
  //     setWorkoutState((prevState) => ({
  //       ...prevState,
  //       saved: true,
  //     }))
  //   } else {
  //     setWorkoutState((prevState) => ({
  //       ...prevState,
  //       saved: false,
  //     }))
  //   }
  // }, [autoSave, files])

  return <RenderCounter name={'AutoSave'} />
}

export default AutoSave
