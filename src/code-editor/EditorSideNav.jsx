/* eslint-disable react/prop-types */
import { Box } from '@mui/material'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import ListItem from '@mui/material/ListItem'
import { useState, useContext } from 'react'
import InfoIcon from '@mui/icons-material/Info'
import BoltIcon from '@mui/icons-material/Bolt'
import { useNavigate } from 'react-router-dom'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { useSandpack } from '@codesandbox/sandpack-react'
import { WorkoutContext } from '../workouts/Workout'

const EditorSideNav = ({ filePanelRef }) => {
  const [activeTab, setActiveTab] = useState('DETAILS')
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
        setActiveTab('FILES')
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
        width: '65px',
        borderRight: '1px solid var(--color-solid-resize-bar)',
        backgroundColor: '#121212',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <List>
        {links.map((link) => (
          <ListItem key={link.name} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={link.onClick}
              sx={{
                flexDirection: 'column',
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                  color: activeTab === link.name ? 'grey.300' : 'grey.600',
                }}
              >
                {link.icon}
              </ListItemIcon>
              <Typography
                sx={{
                  fontSize: '9px',
                  color: activeTab === link.name ? 'grey.300' : 'grey.600',
                }}
              >
                {link.name}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default EditorSideNav
