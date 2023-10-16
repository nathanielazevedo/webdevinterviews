/* eslint-disable react/prop-types */
import Timer from './Timer'
import * as prettier from 'prettier'
import { Button } from '@mui/material'
import Alert from '../components/Alert'
import Tooltip from '@mui/material/Tooltip'
import { useEffect, useState } from 'react'
import { FlashOn } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import parserBabel from 'prettier/parser-babel'
import SaveIcon from '@mui/icons-material/Save'
import InfoIcon from '@mui/icons-material/Info'
import CloseIcon from '@mui/icons-material/Close'
import { useSandpack } from '@codesandbox/sandpack-react'
import Leave from '../components/Leave'
import { useActiveCode } from '@codesandbox/sandpack-react'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined'

const PreviewTabs = ({
  demo,
  saved,
  setCode,
  autoSave,
  challenge,
  setAutoSave,
  setManuallySaved,
  codemirrorInstance,
  setShowInstructions,
}) => {
  const navigate = useNavigate()
  const activeCode = useActiveCode()
  const { sandpack } = useSandpack()
  const [showWarning, setShowWarning] = useState(false)
  const [showLeaveWarning, setShowLeaveWarning] = useState(false)

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

  const leave = () => {
    navigate('/')
  }

  return (
    <div
      style={{
        width: '100%',
        height: '35px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#171717',
        borderBottom: '0.5px solid var(--color-solid-resize-bar)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          sx={{
            height: '30px',
            color: '#C5C5C5',
            minWidth: '30px',
            marginLeft: '10px',
          }}
          onClick={() => {
            if (saved) leave()
            else setShowLeaveWarning(true)
          }}
        >
          <Tooltip title='Leave' style={{ cursor: 'pointer' }}>
            <CloseIcon fontSize='small' />
          </Tooltip>
        </Button>
        <div className='bar-divider'></div>

        <Button
          sx={{
            height: '30px',
            color: '#C5C5C5',
            minWidth: '30px',
          }}
          onClick={() => setShowInstructions(true)}
        >
          <Tooltip title='Show Instructions' style={{ cursor: 'pointer' }}>
            <InfoIcon fontSize='small' />
          </Tooltip>
        </Button>

        <Button
          sx={{ color: autoSave ? '#19e4ff' : '#C5C5C5', minWidth: '30px' }}
          onClick={() => {
            localStorage.setItem('autoSave', !autoSave)
            setAutoSave(!autoSave)
            sandpack.runSandpack()
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
            color: saved ? '#C5C5C5' : '#d32f2f',
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
        onClick={() => setShowWarning(true)}
        sx={{ height: '30px', minWidth: '30px' }}
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
      {showLeaveWarning && (
        <Leave onLeave={leave} setOpen={setShowLeaveWarning} />
      )}
    </div>
  )
}

export default PreviewTabs
