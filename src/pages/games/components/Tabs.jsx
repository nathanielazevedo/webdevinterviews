import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { useState } from 'react'
import List from './List'

function CustomTabPanel(props) {
  const { children, value, index } = props

  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

const CustomTabs = ({ labels, listsInfo }) => {
  const tab = localStorage.getItem('gameTab')
  const [value, setValue] = useState(tab ? Number(tab) : 0)

  const handleChange = (event, newValue) => {
    localStorage.setItem('gameTab', newValue)
    setValue(newValue)
  }

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          {labels.map((label, index) => (
            <Tab label={label} key={index} />
          ))}
        </Tabs>
      </Box>
      {listsInfo.map((listInfo, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          <List
            headerText={listInfo.headerText}
            items={listInfo.items}
            basePath={listInfo.basePath}
          />
        </CustomTabPanel>
      ))}
    </Box>
  )
}

export default CustomTabs
