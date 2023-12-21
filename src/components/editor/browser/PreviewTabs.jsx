/* eslint-disable react/require-default-props */
import * as React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { SandpackPreview, SandpackTests } from '@codesandbox/sandpack-react'

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

const BasicTabs = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', maxHeight: '35px' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{ maxHeight: '30px', padding: '0', margin: 0 }}
        >
          <Tab
            label='Browser'
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
    </Box>
  )
}

export default BasicTabs
