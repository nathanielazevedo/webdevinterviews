/* eslint-disable react/prop-types */
import { ToolbarIcon } from '../code-editor/ToolbarIcons'
import { useNavigate } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useContext } from 'react'
import { WorkoutContext } from '../workouts/Workout'

const Toolbar = () => {
  const navigate = useNavigate()
  const [, setWorkoutState] = useContext(WorkoutContext)

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
        <ToolbarIcon
          icon={{
            title: 'Leave',
            content: <CloseIcon fontSize='small' />,
            onClick: leave,
          }}
        />

        <div className='bar-divider' />

        <ToolbarIcon
          icon={{
            title: 'Close Solution',
            content: <VisibilityIcon fontSize='small' color='inherit' />,
            onClick: () => {
              setWorkoutState((prev) => {
                return {
                  ...prev,
                  showDemo: !prev.showDemo,
                }
              })
            },
          }}
        />
      </div>
    </div>
  )
}

export default Toolbar
