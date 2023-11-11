/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useActiveCode, useSandpack } from '@codesandbox/sandpack-react'

const AutoSave = ({ workout }) => {
  const activeCode = useActiveCode()
  const { sandpack } = useSandpack()

  useEffect(() => {
    if (activeCode.code) {
      try {
        localStorage.setItem(workout.name, JSON.stringify(sandpack.files))
      } catch {
        console.log('error saving')
      }
    }
  }, [activeCode.code])

  return <></>
}

export default AutoSave
