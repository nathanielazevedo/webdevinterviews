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
import { Button } from '@mui/material'

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

  const lockScroll = () => {
    lockScreen
      ? enqueueSnackbar('Screen unlocked.')
      : enqueueSnackbar('Screen locked.')
    setLockScreen(!lockScreen)
    document.body.classList.toggle('stop-scrolling')
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#2f2f2f',
        height: '35px',
      }}
    >
      <ToolbarMenu autoSave={autoSave} setAutoSave={setAutoSave} />
      <div className='bar-divider'></div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          size='small'
          onClick={lockScroll}
          sx={{ color: lockScreen ? '#19e4ff' : 'white', minWidth: '30px' }}
        >
          <Tooltip title='Lock Screen' style={{ cursor: 'pointer' }}>
            {lockScreen ? (
              <LockOutlinedIcon fontSize='small' />
            ) : (
              <LockOpenOutlinedIcon fontSize='small' />
            )}
          </Tooltip>
        </Button>

        <Button sx={{ height: '30px', color: 'white', minWidth: '30px' }}>
          <Tooltip
            title='Format Code'
            onClick={() => {
              formatAndSave(false)
            }}
          >
            <FlashOn fontSize='small' />
          </Tooltip>
        </Button>

        <Button sx={{ height: '30px', color: 'white', minWidth: '30px' }}>
          <Tooltip
            title='Save All'
            style={{ cursor: 'pointer' }}
            onClick={() => formatAndSave(true)}
          >
            <SaveIcon fontSize='small' />
          </Tooltip>
        </Button>
      </div>
      <div className='bar-divider'></div>
      <Timer />
      <div style={{ flex: 1 }}></div>
      <Button color='error' sx={{ height: '30px', minWidth: '30px' }}>
        <Tooltip
          title='Reset Code'
          style={{ cursor: 'pointer' }}
          onClick={() => setShowWarning(true)}
        >
          <RotateLeftOutlinedIcon />
        </Tooltip>
      </Button>
      {showWarning && (
        <Alert
          demo={demo}
          challenge={challenge}
          setCode={setCode}
          setOpen={setShowWarning}
        />
      )}
    </div>
  )
}

export default PreviewTabs
