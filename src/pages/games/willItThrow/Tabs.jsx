import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Structured from './Structured'
import FreeForAll from './FreeForAll'
import { useState } from 'react'

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
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function BasicTabs({ displayName }) {
  const tab = localStorage.getItem('torftab')
  const [value, setValue] = useState(tab ? Number(tab) : 0)

  const handleChange = (event, newValue) => {
    localStorage.setItem('torftab', newValue)
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='basic tabs example'
        >
          <Tab label='Structured' {...a11yProps(0)} />
          <Tab label='Random' {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Structured displayName={displayName} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <FreeForAll displayName={displayName} />
      </CustomTabPanel>
    </Box>
  )
}
