/* eslint-disable react/prop-types */
import { useContext } from 'react'
import { Button, Tooltip } from '@mui/material'
import { getLocalStorage } from './utils'
import InfoIcon from '@mui/icons-material/Info'
import { WorkoutContext } from '../workouts/Workout'
import SaveIcon from '@mui/icons-material/Save'
import { FlashOn } from '@mui/icons-material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import VisibilityIcon from '@mui/icons-material/Visibility'

export const ToolbarIcon = ({ icon }) => {
  return (
    <Button
      sx={{ height: '30px', color: '#C5C5C5', minWidth: '30px' }}
      onClick={() => icon.onClick()}
    >
      <Tooltip title={icon.title} style={{ cursor: 'pointer' }}>
        {icon.content}
      </Tooltip>
    </Button>
  )
}

const ToolbarIcons = ({ autoSave, setAutoSave, formatAndSave }) => {
  const [workoutState, setWorkoutState] = useContext(WorkoutContext)

  const toolbarIcons = [
    {
      title: 'Show Instructions',
      content: <InfoIcon fontSize='small' />,
      onClick: () => {
        if (!workoutState.showInstructions) {
          setWorkoutState((old) => ({
            ...old,
            showInstructions: true,
          }))
          return
        }
      },
    },
    {
      title: autoSave ? 'Turn off Auto Save' : 'Turn on Auto Save',
      content: (
        <FlashOn fontSize='small' color={autoSave ? 'primary' : 'disabled'} />
      ),
      onClick: () => {
        localStorage.setItem('autoSave', !autoSave)
        setAutoSave(!autoSave)
      },
    },
    {
      title: 'Format Code',
      content: <AutoAwesomeIcon fontSize='small' />,
      onClick: () => {
        formatAndSave(false)
      },
    },
    {
      title: workoutState.saved
        ? 'All changes are saved.'
        : 'Some changes are unsaved.',
      content: <SaveIcon fontSize='small' />,
      onClick: () => {
        setWorkoutState((old) => ({
          ...old,
          files: getLocalStorage(old.challenge, !old.showDemo),
          showDemo: !old.showDemo,
        }))
      },
    },
    {
      title: 'Show Solution',
      content: <VisibilityIcon fontSize='small' />,
      onClick: () => {
        setWorkoutState((old) => {
          const files = getLocalStorage(old.challenge, !old.showDemo)
          console.log('files', files)
          return {
            ...old,
            showDemo: !old.showDemo,
            files,
          }
        })
      },
    },
  ]
  return toolbarIcons.map((icon) => (
    <ToolbarIcon key={icon.title} icon={icon} />
  ))
}

export default ToolbarIcons
