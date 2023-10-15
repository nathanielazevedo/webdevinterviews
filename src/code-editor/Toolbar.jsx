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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SaveIcon from '@mui/icons-material/Save'
import Tooltip from '@mui/material/Tooltip'
import Alert from '../components/Alert'
import Timer from './Timer'
import { Button } from '@mui/material'

const PreviewTabs = ({
  setCode,
  codemirrorInstance,
  setManuallySaved,
  challenge,
  demo,
  saved,
  autoSave,
  setAutoSave,
}) => {
  const [lockScreen, setLockScreen] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const activeCode = useActiveCode()
  const { sandpack } = useSandpack()

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

  const updateCode = (formatted) => {
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
    setManuallySaved(true)
  }

  const handleKeyboard = (e) => {
    if (e.repeat) return

    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      formatAndSave(true)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard)
    return () => document.removeEventListener('keydown', handleKeyboard)
  })

  const lockScroll = () => {
    setLockScreen(!lockScreen)
    document.body.classList.toggle('stop-scrolling')
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#171717',
        borderBottom: '0.5px solid var(--color-solid-resize-bar)',
        height: '35px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          onClick={lockScroll}
          sx={{ color: lockScreen ? '#19e4ff' : '#C5C5C5', minWidth: '30px' }}
        >
          <Tooltip
            title={lockScreen ? 'Unlock Screen' : 'Lock Screen'}
            style={{ cursor: 'pointer' }}
          >
            {lockScreen ? (
              <LockOutlinedIcon fontSize='small' />
            ) : (
              <LockOpenOutlinedIcon fontSize='small' />
            )}
          </Tooltip>
        </Button>

        <Button
          sx={{ color: autoSave ? '#19e4ff' : '#C5C5C5', minWidth: '30px' }}
          onClick={() => {
            localStorage.setItem('autoSave', !autoSave)
            setAutoSave(!autoSave)
            sandpack.runSandpack()
            // sandpack.openFile('/package.json')
          }}
        >
          <Tooltip
            title={autoSave ? 'Turn off Auto Save' : 'Turn on Auto Save'}
            style={{ cursor: 'pointer' }}
          >
            <FlashOn fontSize='small' />
          </Tooltip>
        </Button>

        <Button
          sx={{ height: '30px', color: '#C5C5C5', minWidth: '30px' }}
          onClick={() => {
            formatAndSave(false)
          }}
        >
          <Tooltip title='Format Code'>
            <AutoAwesomeIcon fontSize='small' />
          </Tooltip>
        </Button>

        <Button
          sx={{
            height: '30px',
            color: saved ? '#C5C5C5' : 'red',
            minWidth: '30px',
          }}
          onClick={() => formatAndSave(true)}
        >
          <Tooltip
            title={
              saved ? 'All changes are saved.' : 'Some changes are unsaved.'
            }
            style={{ cursor: 'pointer' }}
          >
            <SaveIcon fontSize='small' />
          </Tooltip>
        </Button>
      </div>
      <div className='bar-divider'></div>
      <Timer />
      <div style={{ flex: 1 }}></div>
      <Button
        color='error'
        sx={{ height: '30px', minWidth: '30px' }}
        onClick={() => setShowWarning(true)}
      >
        <Tooltip title='Reset Code' style={{ cursor: 'pointer' }}>
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
