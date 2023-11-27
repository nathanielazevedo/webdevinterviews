/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'
import { debounce, isEqual } from 'lodash'

const AutoSave = ({ workout, files, setFiles }) => {
  const { sandpack } = useSandpack()

  const debounceAutoSave = debounce(() => {
    const editorState = {
      files: sandpack.files,
      activeFile: sandpack.activeFile,
      visibleFiles: sandpack.visibleFiles,
    }
    try {
      console.log('saved')
      localStorage.setItem(workout.id, JSON.stringify(editorState))
    } catch {
      console.log('error saving')
    }
  }, 1000)

  useEffect(() => {
    if (sandpack) {
      if (!isEqual(sandpack.files, files)) {
        // Check if sandpack.files is different from files
        setFiles(sandpack.files)
      }
      debounceAutoSave()
    }
  }, [sandpack])

  return <></>
}

export default AutoSave
