import { useEffect } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'
import { separateFiles } from '../utils'

const AutoSave = ({ workout, isSolution }) => {
  const { sandpack, listen } = useSandpack()

  useEffect(() => {
    const stopListening = listen((msg) => {
      if (msg.type === 'done' && !msg?.compilationError) {
        const { sharedFiles, otherFiles, packageJson } = separateFiles(sandpack.files)

        if (!isSolution) {
          localStorage.setItem(workout.id, JSON.stringify(otherFiles))
        } else {
          localStorage.setItem(`${workout.id}-solution`, JSON.stringify(otherFiles))
        }
        if (true) {
          localStorage.setItem(`${workout.id}-shared`, JSON.stringify(sharedFiles))
          localStorage.setItem(`${workout.id}-package.json`, JSON.stringify(packageJson))
        }
      }
    })

    return () => stopListening()
  }, [listen])
}

export default AutoSave
