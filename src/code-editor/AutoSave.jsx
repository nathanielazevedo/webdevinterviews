/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'

const AutoSave = ({
  demo,
  challenge,
  autoSave,
  setSaved,
  manuallySaved,
  setManuallySaved,
}) => {
  const { sandpack } = useSandpack()
  const { files } = sandpack

  useEffect(() => {
    if (autoSave) {
      const tag = demo ? 'demo' : 'challenge'
      localStorage.setItem(challenge.name + '-' + tag, JSON.stringify(files))
      console.log('auto saved')
      setSaved(true)
      setManuallySaved(false)
      sandpack.runSandpack()
    } else if (manuallySaved) {
      setManuallySaved(false)
      sandpack.runSandpack()
      setSaved(true)
    } else {
      console.log('fuck')
      setSaved(false)
    }
  }, [autoSave, files])

  return <></>
}

export default AutoSave
