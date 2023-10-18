/* eslint-disable react/prop-types */
import { useContext } from 'react'
import { getLocalStorage } from './utils'
import InfoIcon from '@mui/icons-material/Info'
import SaveIcon from '@mui/icons-material/Save'
import { Button, Tooltip } from '@mui/material'
import { WorkoutContext } from '../workouts/Workout'
import { useSandpack } from '@codesandbox/sandpack-react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt'

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

const ToolbarIcons = ({ formatAndSave, renderCountRef }) => {
  const [workoutState, setWorkoutState] = useContext(WorkoutContext)
  const { sandpack } = useSandpack()

  const toolbarIcons = [
    {
      title: workoutState.showInstructions
        ? 'Close Instructions'
        : 'Show Instructions',
      content: (
        <InfoIcon
          fontSize='small'
          color={workoutState.showInstructions ? 'primary' : 'inherit'}
        />
      ),
      onClick: () => {
        setWorkoutState((prev) => ({
          ...prev,
          showInstructions: !prev.showInstructions,
        }))
      },
    },
    {
      title: workoutState.showDemo ? 'Close Solution' : 'Show Solution',
      content: (
        <VisibilityIcon
          fontSize='small'
          color={workoutState.showDemo ? 'primary' : 'inherit'}
        />
      ),
      onClick: () => {
        let files
        setWorkoutState((prev) => {
          renderCountRef.current = 0
          const newShowDemo = !prev.showDemo
          files = newShowDemo
            ? prev.challenge.demo
            : getLocalStorage(prev.challenge)
          return {
            ...prev,
            files,
            unSavedFiles: [],
            showDemo: newShowDemo,
          }
        })
        sandpack.updateFile(files, true)
        // sandpack.runSandpack()
      },
    },
    {
      title: workoutState.showDemo
        ? 'Cannot save solution.'
        : 'Format and Save.',
      content: workoutState.showDemo ? (
        <DoDisturbAltIcon fontSize='small' />
      ) : (
        <SaveIcon fontSize='small' />
      ),
      onClick: workoutState.showDemo ? () => {} : formatAndSave,
    },
  ]

  return toolbarIcons.map((icon) => {
    return <ToolbarIcon key={icon.title} icon={icon} />
  })
}

export default ToolbarIcons
