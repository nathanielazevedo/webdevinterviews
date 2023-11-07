/* eslint-disable react/prop-types */
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { WorkoutContext } from '../workouts/Workout'
import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography } from '@mui/material'
import * as prettier from 'prettier'
import parserBabel from 'prettier/parser-babel'
import { useSandpack } from '@codesandbox/sandpack-react'
import { useActiveCode } from '@codesandbox/sandpack-react'
import Alert from '../components/Alert'

export default function BasicMenu({ codemirrorInstance }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [workoutState, setWorkoutState] = useContext(WorkoutContext)
  const [showWarning, setShowWarning] = useState(false)
  const navigate = useNavigate()
  const { sandpack } = useSandpack()
  const activeCode = useActiveCode()
  const open = Boolean(anchorEl)
  const [prettierCode, setPrettierCode] = useState('')
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const leave = () => {
    navigate('/workouts')
  }

  const runPrettier = () => {
    handleClose()
    if (activeCode.code) {
      try {
        const formatted = prettier.format(activeCode.code, {
          parser: 'babel',
          plugins: [parserBabel],
        })

        setPrettierCode(formatted)
      } catch {
        console.error('Prettier failed to format the code')
      }
    }
  }

  useEffect(() => {
    if (prettierCode) {
      const cmInstance = codemirrorInstance.current.getCodemirror()

      if (cmInstance) {
        const trans = cmInstance.state.update({
          selection: cmInstance.state.selection,
          changes: {
            from: 0,
            to: cmInstance.state.doc.length,
            insert: prettierCode,
          },
        })

        cmInstance.update([trans])
      }

      sandpack.updateFile(sandpack.activeFile, prettierCode)

      setPrettierCode(null)
    }
  }, [prettierCode])

  return (
    <div>
      <Button
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Typography variant='subtitle' color='grey.200' textTransform='none'>
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
        <MenuItem onClick={runPrettier}>
          {' '}
          <Typography fontSize='14px'>Format</Typography>
        </MenuItem>

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

        <MenuItem
          onClick={() => {
            setWorkoutState((prev) => ({
              ...prev,
              activeFile: sandpack.activeFile,
              visibleFiles: sandpack.visibleFiles,
              showInstructions: !prev.showInstructions,
            }))
            handleClose()
          }}
        >
          <Typography fontSize='14px'>
            {workoutState.showInstructions
              ? 'Close Instructions'
              : 'Show Instructions'}
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setWorkoutState((prev) => {
              return {
                ...prev,
                showDemo: !prev.showDemo,
              }
            })
            handleClose()
          }}
        >
          <Typography fontSize='14px'>View Solution</Typography>
        </MenuItem>
        <MenuItem onClick={() => setShowWarning(true)}>
          <Typography fontSize='14px'>Reset Code</Typography>
        </MenuItem>
        <MenuItem onClick={leave}>
          <Typography fontSize='14px'>Exit</Typography>
        </MenuItem>
      </Menu>
      {showWarning && <Alert setOpen={setShowWarning} />}
    </div>
  )
}
