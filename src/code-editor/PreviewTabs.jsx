/* eslint-disable react/prop-types */
import { useSandpack } from '@codesandbox/sandpack-react'
import * as prettier from 'prettier'
import parserBabel from 'prettier/parser-babel'
import { useEffect, useState, useCallback } from 'react'
import { useActiveCode } from '@codesandbox/sandpack-react'
import { FlashOn } from '@mui/icons-material'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Tooltip from '@mui/material/Tooltip'

const PreviewTabs = ({ setCode, codemirrorInstance }) => {
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
        <div style={{ flex: 1 }}></div>
        <Tooltip title='Lock Screen'>
          <div
            onClick={() => {
              setLockScreen(!lockScreen)
              document.body.classList.toggle('stop-scrolling')
            }}
            style={{
              color: lockScreen ? '#dcdcaa' : 'white',
              cursor: 'pointer',
            }}
          >
            {lockScreen ? <LockOutlinedIcon /> : <LockOpenOutlinedIcon />}
          </div>
        </Tooltip>
        <Tooltip title='Format Code'>
          <div
            onClick={() => {
              runPrettier()
            }}
            style={{
              // padding: '10px 5px',
              cursor: 'pointer',
            }}
          >
            <FlashOn />
          </div>
        </Tooltip>
        <Tooltip title='Reset Code'>
          <div
            onClick={() => {
              setCode('{}')
            }}
            style={{
              marginRight: '10px',
              cursor: 'pointer',
            }}
          >
            <RotateLeftOutlinedIcon />
          </div>
        </Tooltip>
      </div>
    </>
  )
}

export default PreviewTabs
