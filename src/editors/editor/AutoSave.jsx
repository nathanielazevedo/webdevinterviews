/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useContext } from 'react'
import { WorkoutContext } from '../../pages/EditorEntrance'
import { useActiveCode, useSandpack } from '@codesandbox/sandpack-react'

const AutoSave = () => {
  const activeCode = useActiveCode()
  const { sandpack } = useSandpack()
  const [workoutState] = useContext(WorkoutContext)

  useEffect(() => {
    if (activeCode.code) {
      try {
        if (workoutState.showDemo) return
        localStorage.setItem(
          workoutState.challenge.name,
          JSON.stringify(sandpack.files)
        )
      } catch {
        console.log('error saving')
      }
    }
  }, [activeCode.code])

  return <></>
}

export default AutoSave
