/* eslint-disable react/require-default-props */
import * as React from 'react'
import PropTypes from 'prop-types'
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
import { Divider } from '@mui/material'
import { theme } from '../theme'
import WorkoutContext from '../../../pages/workout/root/WorkoutContext'
import Workout from '../../../models/workout'

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <div hidden={value !== index} style={{ height: '100%' }} {...other}>
      {value === index && <Box sx={{ height: '100%' }}>{children}</Box>}
    </div>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

const BasicTabs = ({ files }) => {
  const [value, setValue] = React.useState(0)
  const { workoutData } = React.useContext(WorkoutContext)
  const workout = new Workout(workoutData)
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
          maxHeight: '35px',
          backgroundColor: '#121212',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{ maxHeight: '30px', padding: '0', margin: 0 }}
        >
          <Tab
            label='Browser'
            onClick={() => sandpack.runSandpack()}
            sx={{
              fontSize: '12px',
              padding: '0',
              margin: 0,
              minHeight: '35px',
              maxHeight: '35px',
            }}
          />
          <Tab
            label='Tests'
            sx={{
              fontSize: '12px',
              padding: '0',
              margin: 0,
              minHeight: '35px',
              maxHeight: '35px',
            }}
          />
          <Tab
            label='Instructions'
            sx={{
              fontSize: '12px',
              margin: 0,
              minHeight: '35px',
              maxHeight: '35px',
              padding: '0 15px',
            }}
          />
          <Tab
            label='Example'
            sx={{
              fontSize: '12px',
              padding: '0',
              margin: 0,
              minHeight: '35px',
              maxHeight: '35px',
            }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <SandpackPreview
          showNavigator
          style={{ height: '100%' }}
          showOpenInCodeSandbox={false}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <SandpackTests style={{ height: '100%' }} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <SandpackProvider
          files={sandpack.files}
          template={workout.spTemplate.name}
          customSetup={{
            dependencies: workout.dependencies ?? {},
            entry: '/Instructions.js',
          }}
          options={{
            autoReload: true,
            activeFile: '/Instructions.js',
            visibleFiles: ['/Instructions.js'],
          }}
        >
          <SandpackThemeProvider theme={theme}>
            <SandpackPreview
              showNavigator
              style={{ height: '100%' }}
              showOpenInCodeSandbox={false}
            />
          </SandpackThemeProvider>
        </SandpackProvider>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <SandpackProvider
          files={workoutData.dynamo_data.solution}
          template={workout.spTemplate.name}
          customSetup={{
            dependencies: workout.dependencies ?? {},
          }}
          options={{
            autoReload: true,
            activeFile: '/Instructions.js',
            visibleFiles: ['/Instructions.js'],
          }}
        >
          <SandpackThemeProvider theme={theme}>
            <SandpackPreview
              showNavigator
              style={{ height: '100%' }}
              showOpenInCodeSandbox={false}
            />
          </SandpackThemeProvider>
        </SandpackProvider>
      </CustomTabPanel>
    </Box>
  )
}

export default BasicTabs
