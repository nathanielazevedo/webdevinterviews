/* eslint-disable function-paren-newline */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'

const handleSharedFiles = (files) => {
  const sharedFiles = {}
  const otherFiles = {}

  Object.keys(files).forEach((key) => {
    if (key.startsWith('/shared')) {
      sharedFiles[key] = files[key]
    } else {
      otherFiles[key] = files[key]
    }
  })
  return { sharedFiles, otherFiles }
}

const AutoSave = ({ workout, isSolution, cmInstance }) => {
  const { sandpack, listen } = useSandpack()
  console.log(sandpack.files)
  useEffect(() => {
    // listens for any message dispatched between sandpack and the bundler
    const stopListening = listen((msg) => {
      if (msg.type === 'done' && !msg?.compilationErro) {
        const { sharedFiles, otherFiles } = handleSharedFiles(sandpack.files)
        if (!isSolution) {
          localStorage.setItem(workout.id, JSON.stringify(otherFiles))
        } else {
          localStorage.setItem(
            `${workout.id}-solution`,
            JSON.stringify(otherFiles)
          )
        }
        localStorage.setItem(
          `${workout.id}-shared`,
          JSON.stringify(sharedFiles)
        )
      }
    })

    return () => {
      stopListening()
    }
  }, [listen])

  return <></>
}

export default AutoSave
