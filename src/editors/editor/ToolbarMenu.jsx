/* eslint-disable react/prop-types */
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { WorkoutContext } from '../../App'
import { useContext, useState } from 'react'
import { Typography } from '@mui/material'
import { useSandpack } from '@codesandbox/sandpack-react'
import Alert from '../components/Alert'

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [workoutState, setWorkoutState] = useContext(WorkoutContext)
  const [showWarning, setShowWarning] = useState(false)
  const { sandpack } = useSandpack()
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Typography variant='subtitle' textTransform='none'>
          FILE
        </Typography>
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          onClick={() => {
            setWorkoutState((prev) => {
              return {
                ...prev,
                activeFile: sandpack.activeFile,
                visibleFiles: sandpack.visibleFiles,
                showTests: !prev.showTests,
              }
            })
            sandpack.runSandpack()
            handleClose()
          }}
        >
          <Typography fontSize='14px'>
            {!workoutState.showTests ? 'Run Tests' : 'Close Tests'}
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => setShowWarning(true)}>
          <Typography fontSize='14px'>Reset Code</Typography>
        </MenuItem>
      </Menu>
      {showWarning && <Alert setOpen={setShowWarning} />}
    </div>
  )
}
