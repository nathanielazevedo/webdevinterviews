/* eslint-disable react/no-danger */
import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import {
  SandpackPreview,
  SandpackProvider,
  SandpackTests,
  SandpackThemeProvider,
  useSandpack,
} from '@codesandbox/sandpack-react'
import { theme } from '../theme'
import { WorkoutContext } from '../../../../contexts/WorkoutContext'

const BasicTabs = () => {
  const [value, setValue] = React.useState(0)
  const { workout } = React.useContext(WorkoutContext)
  const { sandpack } = useSandpack()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: '#121212',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{ height: '20px', minHeight: '40px' }}
        >
          {['Browser', 'Tests', 'Instructions', 'Example'].map((label) => (
            <Tab
              key={label}
              label={label}
              style={{ minWidth: 50, fontSize: 12, minHeight: 30 }}
            />
          ))}
        </Tabs>
      </Box>

      {value === 0 && (
        <SandpackPreview
          showNavigator
          style={{ height: 'calc(100% - 40px)' }}
          showOpenInCodeSandbox={false}
        />
      )}
      {value === 1 && <SandpackTests style={{ height: 'calc(100% - 40px)' }} />}
      {value === 2 && (
        <div
          dangerouslySetInnerHTML={{
            __html: sandpack?.files['/shared/Instructions.html']?.code ?? '',
          }}
        />
      )}

      {value === 3 && (
        <SandpackProvider
          files={workoutData.dynamo_data.solution}
          template={workout.spTemplate.name}
        >
          <SandpackThemeProvider theme={theme}>
            <SandpackPreview
              showNavigator
              style={{ height: 'calc(100% - 40px)' }}
              showOpenInCodeSandbox={false}
            />
          </SandpackThemeProvider>
        </SandpackProvider>
      )}
    </Box>
  )
}

export default BasicTabs
