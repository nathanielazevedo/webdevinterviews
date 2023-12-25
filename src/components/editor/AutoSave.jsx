/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'

const AutoSave = ({ workout, isSolution }) => {
  const { sandpack, listen } = useSandpack()

  useEffect(() => {
    // listens for any message dispatched between sandpack and the bundler
    const stopListening = listen((msg) => {
      if (msg.type === 'status' && msg.status === 'transpiling') {
        if (!isSolution) {
          localStorage.setItem(workout.id, JSON.stringify(sandpack.files))
        } else {
          localStorage.setItem(
            `${workout.id}-solution`,
            JSON.stringify(sandpack.files)
          )
        }
      }
    })

    return () => {
      // unsubscribe
      stopListening()
    }
  }, [listen])

  return <></>
}

export default AutoSave
