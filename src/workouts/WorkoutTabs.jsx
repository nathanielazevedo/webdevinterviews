/* eslint-disable react/prop-types */
import * as React from 'react'
import Code from './tabs/Code'
import PropTypes from 'prop-types'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import Demo from './tabs/Demo'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, pt: 6, pb: 6 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function BasicTabs({ challenge }) {
  const [tab, setTab] = React.useState(1)

  const handleChange = (event, newValue) => {
    setTab(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleChange}>
          <Tab label='Challenge' {...a11yProps(0)} />
          <Tab label='Code' {...a11yProps(0)} />
          <Tab label='Demo / Solution' {...a11yProps(1)} />
          <Tab label='YouTube' {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tab} index={0}>
        First Tab
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={1}>
        <Code challenge={challenge} />
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={2}>
        <Demo challenge={challenge} />
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={3}>
        Item Three
      </CustomTabPanel>
    </Box>
  )
}
