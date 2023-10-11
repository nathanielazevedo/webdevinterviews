/* eslint-disable react/prop-types */
import { useSandpack } from '@codesandbox/sandpack-react'
import * as prettier from 'prettier'
import parserBabel from 'prettier/parser-babel'
import { useEffect, useState, useCallback } from 'react'
import { useActiveCode } from '@codesandbox/sandpack-react'
const PreviewTabs = ({
  showConsole,
  setShowConsole,
  setCode,
  codemirrorInstance,
}) => {
  const [prettierCode, setPrettierCode] = useState('')
  const [lockScreen, setLockScreen] = useState(false)
  const { sandpack } = useSandpack()
  const activeCode = useActiveCode()

  const runPrettier = useCallback(() => {
    if (activeCode.code) {
      try {
        /**
         * I would recomend to run this process in a Worker
         */
        const formatted = prettier.format(activeCode.code, {
          parser: 'babel',
          plugins: [parserBabel],
        })

        setPrettierCode(formatted)
      } catch (e) {
        console.log(e)
      }
    }
  }, [activeCode.code])

  useEffect(() => {
    if (prettierCode) {
      const cmInstance = codemirrorInstance.current.getCodemirror()

      if (cmInstance) {
        try {
          const trans = cmInstance.state.update({
            selection: cmInstance.state.selection,
            changes: {
              from: 0,
              to: cmInstance.state.doc.length,
              insert: prettierCode,
            },
          })
          cmInstance.update([trans])
        } catch {
          console.log('error')
        }
      }

      sandpack.updateFile(sandpack.activePath, prettierCode)

      setPrettierCode(null)
    }
  }, [prettierCode])
  return (
    <>
      <div
        style={{
          height: '4vh',
          display: 'flex',
          alignItems: 'center',

          gap: '20px',
        }}
      >
        <div
          onClick={() => {
            setShowConsole(false)
          }}
          style={{
            padding: '10px 10px',
            color: showConsole ? 'white' : '#19e4ff',
            cursor: 'pointer',
          }}
        >
          Browser
        </div>
        <div
          onClick={() => {
            setShowConsole(true)
          }}
          style={{
            padding: '10px 10px',
            color: showConsole ? '#19e4ff' : 'white',
            cursor: 'pointer',
          }}
        >
          Console
        </div>
        <div style={{ flex: 1 }}></div>
        <div
          onClick={() => {
            setLockScreen(!lockScreen)
            document.body.classList.toggle('stop-scrolling')
          }}
          style={{
            padding: '10px 5px',
            color: lockScreen ? '#19e4ff' : 'white',
            cursor: 'pointer',
          }}
        >
          Lock Scroll
        </div>
        <div
          onClick={() => {
            runPrettier()
          }}
          style={{
            padding: '10px 5px',
            cursor: 'pointer',
          }}
        >
          Format Code
        </div>
        <div
          onClick={() => {
            setCode('{}')
          }}
          style={{
            padding: '10px 10px',
            cursor: 'pointer',
          }}
        >
          Reset Code
        </div>
      </div>
    </>
  )
}

export default PreviewTabs
