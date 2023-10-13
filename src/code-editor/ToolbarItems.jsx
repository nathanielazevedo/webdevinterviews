/* eslint-disable react/prop-types */
import { useSandpack } from '@codesandbox/sandpack-react'
import * as prettier from 'prettier'
import parserBabel from 'prettier/parser-babel'
import { useEffect, useState } from 'react'
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
import Timer from './Timer'

const PreviewTabs = ({
  setCode,
  codemirrorInstance,
  challenge,
  demo,
  autoSave,
  setAutoSave,
}) => {
  const [lockScreen, setLockScreen] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const { sandpack } = useSandpack()
  const activeCode = useActiveCode()
  const { enqueueSnackbar } = useSnackbar()

  const runPrettier = (save) => {
    if (activeCode.code) {
      try {
        const formatted = prettier.format(activeCode.code, {
          parser: 'babel',
          plugins: [parserBabel],
        })

        updateCode(formatted, save)
        return formatted
      } catch (e) {
        console.log(e)
      }
    }
  }

  const updateCode = (formatted, save) => {
    if (formatted) {
      const cmInstance = codemirrorInstance.current.getCodemirror()

      if (cmInstance) {
        try {
          const trans = cmInstance.state.update({
            selection: cmInstance.state.selection,
            changes: {
              from: 0,
              to: cmInstance.state.doc.length,
              insert: formatted,
            },
          })
          sandpack.updateCurrentFile(formatted)
          cmInstance.update([trans])
        } catch {
          console.log('error')
        }
      }
      !save && enqueueSnackbar('Formatted.')
      save && enqueueSnackbar('Saved.')
      sandpack.updateFile(sandpack.activePath, formatted)
    }
  }

  const formatAndSave = (save) => {
    const formatted = runPrettier(save)
    const newData = {}
    const keys = Object.keys(sandpack.files)
    keys.forEach((each) => {
      if (each === sandpack.activeFile) {
        newData[each] = formatted
      } else newData[each] = sandpack.files[each].code
    })
    localStorage.setItem(challenge.id, JSON.stringify(newData))
    sandpack.runSandpack()
  }

  const handleKeyboard = (e) => {
    if (e.repeat) return

    // Handle both, `ctrl` and `meta`.
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      formatAndSave(true)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard)

    // Important to remove the listeners.
    return () => document.removeEventListener('keydown', handleKeyboard)
  })

  return (
    <>
      <ToolbarMenu autoSave={autoSave} setAutoSave={setAutoSave} />
      <div className='bar-divider'></div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
        }}
      >
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
              formatAndSave(false)
            }}
            style={{
              cursor: 'pointer',
            }}
          >
            <FlashOn />
          </div>
        </Tooltip>
        <Tooltip title='Save'>
          <div
            onClick={() => formatAndSave(true)}
            style={{
              cursor: 'pointer',
            }}
          >
            <SaveIcon />
          </div>
        </Tooltip>
      </div>
      <div className='bar-divider'></div>
      <div>
        <Timer />
      </div>

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
