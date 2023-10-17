/* eslint-disable react/prop-types */
import Timer from './Timer'
import * as prettier from 'prettier'
import Alert from '../components/Alert'
import Leave from '../components/Leave'
import { ToolbarIcon } from './ToolbarIcons'
import { setLocalStorage } from './utils'
import ToolbarIcons from './ToolbarIcons'
import { useNavigate } from 'react-router-dom'
import parserBabel from 'prettier/parser-babel'
import CloseIcon from '@mui/icons-material/Close'
import { WorkoutContext } from '../workouts/Workout'
import { useContext, useEffect, useState } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'
import { useActiveCode } from '@codesandbox/sandpack-react'
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined'
import { RenderCounter } from '../components/RenderCount'

const Toolbar = ({ autoSave, setAutoSave, setManuallySaved }) => {
  const navigate = useNavigate()
  const activeCode = useActiveCode()
  const { sandpack } = useSandpack()
  const [showWarning, setShowWarning] = useState(false)
  const [showLeaveWarning, setShowLeaveWarning] = useState(false)
  const [workoutState, setWorkoutState] = useContext(WorkoutContext)

  const runPrettier = () => {
    if (activeCode.code) {
      try {
        const formatted = prettier.format(activeCode.code, {
          parser: 'babel',
          plugins: [parserBabel],
        })
        return formatted
      } catch (e) {
        console.log(e)
      }
    }
  }

  const formatAndSave = () => {
    const formatted = runPrettier()
    const files = sandpack.files
    files[sandpack.activeFile].code = formatted
    setLocalStorage(workoutState.challenge, workoutState.showDemo, files)
    setWorkoutState((prevState) => ({
      ...prevState,
      files,
      saved: true,
    }))
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
      <RenderCounter name={'Toolbar'} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ToolbarIcon
          icon={{
            title: 'Leave',
            content: <CloseIcon fontSize='small' />,
            onClick: () => {
              if (workoutState.saved) leave()
              else setShowLeaveWarning(true)
            },
          }}
        />

        <div className='bar-divider' />

        {/* <ToolbarIcons
          autoSave={autoSave}
          formatAndSave={formatAndSave}
          setAutoSave={setAutoSave}
        /> */}
      </div>

      <div className='bar-divider' />
      <Timer />
      <div style={{ flex: 1 }}></div>

      <ToolbarIcon
        icon={{
          title: 'Reset Code',
          content: <RotateLeftOutlinedIcon />,
          onClick: () => setShowWarning(true),
        }}
      />

      {showWarning && <Alert setOpen={setShowWarning} />}
      {showLeaveWarning && (
        <Leave onLeave={leave} setOpen={setShowLeaveWarning} />
      )}
    </div>
  )
}

export default Toolbar
