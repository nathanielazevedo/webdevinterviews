/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import { useContext } from 'react'
import InfoIcon from '@mui/icons-material/Info'
import BoltIcon from '@mui/icons-material/Bolt'
import { useNavigate } from 'react-router-dom'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { useSandpack } from '@codesandbox/sandpack-react'
import { WorkoutContext } from '../../pages/EditorEntrance'
import SideNav1 from '../../components/frame/SideNav1'

const EditorSideNav = ({ filePanelRef }) => {
  const [workoutState, setWorkoutState] = useContext(WorkoutContext)
  const { sandpack } = useSandpack()
  const navigate = useNavigate()
  const leave = () => {
    navigate('/workouts')
  }
  const closeFilePanel = () => {
    if (filePanelRef.current) {
      if (filePanelRef.current.getSize() === 0) {
        filePanelRef.current.resize(12)
        return
      }
      filePanelRef.current.resize(0)
    }
  }

  const closeDetailsPanel = () => {
    setWorkoutState((prev) => ({
      ...prev,
      showInstructions: false,
    }))
  }

  const links = [
    {
      name: 'DETAILS',
      icon: <InfoIcon />,
      onClick: () => {
        if (workoutState.showInstructions) {
          return
        }
        setWorkoutState((prev) => ({
          ...prev,
          activeFile: sandpack.activeFile,
          visibleFiles: sandpack.visibleFiles,
          showInstructions: !prev.showInstructions,
        }))
        setActiveTab('DETAILS')
      },
    },
    {
      name: 'FILES',
      icon: <FileCopyIcon />,
      onClick: () => {
        closeFilePanel()
        setActiveTab('FILES')
        closeDetailsPanel()
      },
    },
    {
      name: 'TESTS',
      icon: <BoltIcon />,
      onClick: () => {
        closeFilePanel()
        closeDetailsPanel()
      },
    },
    {
      name: 'SOLUTION',
      icon: <FileCopyIcon />,
      onClick: () => {
        setWorkoutState((prev) => {
          return {
            ...prev,
            showDemo: !prev.showDemo,
          }
        })
        closeDetailsPanel()
      },
    },
    {
      name: 'EXIT',
      icon: <ExitToAppIcon />,
      onClick: () => {
        leave()
      },
    },
  ]

  return (
    <Box
      sx={{
        backgroundColor: '#121212',
        borderRight: '1px solid var(--color-solid-resize-bar-handle)',
      }}
    >
      <SideNav1 links={links} />
    </Box>
  )
}

export default EditorSideNav
