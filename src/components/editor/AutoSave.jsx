/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useSandpack, useTranspiledCode } from '@codesandbox/sandpack-react'
import { debounce, isEqual } from 'lodash'

const AutoSave = ({ workout, files, setFiles, isSolution }) => {
  const { sandpack, dispatch, listen } = useSandpack()

  useEffect(() => {
    // listens for any message dispatched between sandpack and the bundler
    const stopListening = listen((msg) => {
      if (msg.type === 'status' && msg.status === 'transpiling') {
        localStorage.setItem(workout.id, JSON.stringify(sandpack.files))
      }
    })

    return () => {
      // unsubscribe
      stopListening()
    }
  }, [listen])

  // const debounceAutoSave = debounce(() => {
  //   const editorState = {
  //     files: sandpack.files,
  //     activeFile: sandpack.activeFile,
  //     visibleFiles: sandpack.visibleFiles,
  //   }

  //   console.log(sandpack)
  //   // const consoleMessageAction = {
  //   //   type: 'console',
  //   //   log: [
  //   //     {
  //   //       method: 'error',
  //   //       id: '659d1b63-6dc0-aa22-05d6-0c0a-1702488481391s',
  //   //       data: ['hello from me'],
  //   //     },
  //   //   ],
  //   // }

  //   // Assuming you have access to the `dispatch` function from your useSandpack hook
  //   dispatch({ type: 'console' })

  //   try {
  //     // console.log('saved')
  //     // localStorage.setItem(workout.id, JSON.stringify(editorState))
  //     // console.log(editorState)
  //   } catch {
  //     // console.log('error saving')
  //   }
  // }, 1000)

  // useEffect(() => {
  //   if (sandpack) {
  //     if (!isEqual(sandpack.files, files)) {
  //       // Check if sandpack.files is different from files
  //       // setFiles(sandpack.files)
  //     }
  //     debounceAutoSave()
  //   }
  // }, [sandpack])

  return <></>
}

export default AutoSave
