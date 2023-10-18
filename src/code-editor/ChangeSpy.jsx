/* eslint-disable react/prop-types */
import { useContext, useEffect } from 'react'
import { WorkoutContext } from '../workouts/Workout'
import { useSandpack } from '@codesandbox/sandpack-react'

const ChangeSpy = ({ renderCountRef }) => {
  const { sandpack } = useSandpack()
  const [workoutState, setWorkoutState] = useContext(WorkoutContext)
  console.log(renderCountRef.current)

  useEffect(() => {
    workoutState.unSavedFiles.forEach((path) => {
      const container = document.querySelector(
        '[aria-label="Select active file"]'
      )
      container.style.display = 'flex'
      container.style.alignItems = 'center'
      const element = document.querySelector('[title="' + path + '"]')
      try {
        if (!element.querySelector('.circle')) {
          const newNode = document.createElement('div')
          newNode.className = 'circle'
          newNode.style.width = '10px'
          newNode.style.height = '10px'
          newNode.style.marginRight = '10px'
          newNode.style.borderRadius = '50%'
          newNode.style.backgroundColor = 'white'
          newNode.style.display = 'flex'
          newNode.style.justifyContent = 'center'
          newNode.style.alignItems = 'center'
          element.prepend(newNode)
        }
      } catch {
        console.log('error')
      }
    })

    if (renderCountRef.current < 3) {
      renderCountRef.current++
      return
    } else {
      if (workoutState.showDemo) return
      else if (workoutState.unSavedFiles.includes(sandpack.activeFile)) return
      else {
        renderCountRef.current++
        setWorkoutState((prevState) => ({
          ...prevState,
          unSavedFiles: [...prevState.unSavedFiles, sandpack.activeFile],
        }))
      }
    }
    return () => {
      renderCountRef.current = 0
    }
  }, [
    renderCountRef,
    sandpack.activeFile,
    sandpack.files,
    setWorkoutState,
    workoutState.showDemo,
    workoutState.unSavedFiles,
  ])

  useEffect(() => {
    setWorkoutState((prevState) => ({
      ...prevState,
      activeFile: sandpack.activeFile,
      visibleFiles: sandpack.visibleFiles,
    }))
  }, [sandpack.visibleFiles])

  return <></>
}

export default ChangeSpy
