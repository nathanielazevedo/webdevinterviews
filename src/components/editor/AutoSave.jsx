/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'

const AutoSave = ({ workout }) => {
  const { sandpack } = useSandpack()

  useEffect(() => {
    if (sandpack) {
      const editorState = {
        files: sandpack.files,
        activeFile: sandpack.activeFile,
        visibleFiles: sandpack.visibleFiles,
      }
      try {
        localStorage.setItem(workout.name, JSON.stringify(editorState))
      } catch {
        console.log('error saving')
      }
    }
  }, [sandpack])

  return <></>
}

export default AutoSave
