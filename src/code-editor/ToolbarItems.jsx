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
import SaveIcon from '@mui/icons-material/Save'
import Tooltip from '@mui/material/Tooltip'
import Alert from '../components/Alert'
import { useSnackbar } from 'notistack'
import ToolbarMenu from './ToolbarMenu'

const PreviewTabs = ({ setCode, codemirrorInstance, challenge, demo }) => {
  const [prettierCode, setPrettierCode] = useState('')
  const [lockScreen, setLockScreen] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const { sandpack } = useSandpack()
  const activeCode = useActiveCode()
  const { enqueueSnackbar } = useSnackbar()

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
      enqueueSnackbar('Format complete.')
      sandpack.updateFile(sandpack.activePath, prettierCode)

      setPrettierCode(null)
    }
  }, [prettierCode])

  return (
    <>
      <ToolbarMenu />
      <Tooltip title='Lock Screen'>
        <div
          onClick={() => {
            lockScreen
              ? enqueueSnackbar('Screen unlocked.')
              : enqueueSnackbar('Screen locked.')
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
            cursor: 'pointer',
          }}
        >
          <FlashOn />
        </div>
      </Tooltip>
      <Tooltip title='Auto Save'>
        <div
          onClick={() => {
            runPrettier()
          }}
          style={{
            cursor: 'pointer',
          }}
        >
          <SaveIcon />
        </div>
      </Tooltip>
      <div style={{ flex: 1 }}></div>
      <Tooltip title='Reset Code'>
        <div
          onClick={() => {
            setShowWarning(true)
          }}
          style={{
            cursor: 'pointer',
          }}
        >
          <RotateLeftOutlinedIcon />
        </div>
      </Tooltip>
      {showWarning && (
        <Alert
          demo={demo}
          challenge={challenge}
          setCode={setCode}
          setOpen={setShowWarning}
        />
      )}
    </>
  )
}

export default PreviewTabs
