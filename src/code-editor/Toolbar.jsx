/* eslint-disable react/prop-types */
import Timer from './Timer'
import * as prettier from 'prettier'
import Alert from '../components/Alert'
import Leave from '../components/Leave'
import { setLocalStorage } from './utils'
import ToolbarIcons from './ToolbarIcons'
import { ToolbarIcon } from './ToolbarIcons'
import { useNavigate } from 'react-router-dom'
import parserBabel from 'prettier/parser-babel'
import CloseIcon from '@mui/icons-material/Close'
import { WorkoutContext } from '../workouts/Workout'
import { useContext, useEffect, useState } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'
import { RenderCounter } from '../components/RenderCount'
import { useActiveCode } from '@codesandbox/sandpack-react'
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined'

const Toolbar = ({ renderCountRef }) => {
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
    // Remove all elements with class name 'circle'
    const circles = document.querySelectorAll('.circle')
    circles.forEach((circle) => circle.remove())
    setLocalStorage(workoutState.challenge, files)
    setWorkoutState((prevState) => ({
      ...prevState,
      files,
      unSavedFiles: [],
    }))
  }

  const handleKeyboard = (e) => {
    if (e.repeat) return
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      formatAndSave(true)
    }
  }

  useEffect(() => {
    if (workoutState.showDemo) return
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

        <ToolbarIcons
          formatAndSave={formatAndSave}
          renderCountRef={renderCountRef}
        />
      </div>

      <div className='bar-divider' />
      <Timer />
      <div style={{ flex: 1 }}></div>

      <ToolbarIcon
        icon={{
          title: 'Reset Code',
          content: <RotateLeftOutlinedIcon color='error' />,
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
