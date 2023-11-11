/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import { useState, useEffect } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'
import { useActiveCode } from '@codesandbox/sandpack-react'
import * as prettier from 'prettier'
import parserBabel from 'prettier/parser-babel'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import Alert from '../../components/Alert'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { WorkoutContext } from '../../App'
import { useContext } from 'react'
import BoltIcon from '@mui/icons-material/Bolt'

export default function BasicSpeedDial({ codemirrorInstance, workout }) {
  const [prettierCode, setPrettierCode] = useState('')
  const [showWarning, setShowWarning] = useState(false)
  const { sandpack } = useSandpack()
  const activeCode = useActiveCode()
  const [workoutState, setWorkoutState] = useContext(WorkoutContext)

  const runPrettier = () => {
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

  const actions = [
    { icon: <AutoAwesomeIcon />, name: 'Format', onClick: runPrettier },
    { icon: <DirectionsRunIcon />, name: 'Run', onClick: sandpack.runSandpack },
    {
      icon: <RestartAltIcon />,
      name: 'Reset Code',
      onClick: () => setShowWarning(true),
    },
    {
      icon: <BoltIcon />,
      name: workoutState.showTests ? 'Close Tests' : 'Run Tests',
      onClick: () => {
        setWorkoutState((prev) => {
          return {
            ...prev,
            showTests: !prev.showTests,
          }
        })
        sandpack.runSandpack()
      },
    },
  ]

  return (
    <Box
      sx={{
        height: 320,
        transform: 'translateZ(0px)',
        position: 'absolute',
        bottom: 16,
        right: 16,
      }}
    >
      <SpeedDial
        ariaLabel='SpeedDial basic example'
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
        }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
      {showWarning && <Alert setOpen={setShowWarning} workout={workout} />}
    </Box>
  )
}
