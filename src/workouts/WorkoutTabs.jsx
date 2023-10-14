/* eslint-disable react/prop-types */
import * as React from 'react'
import Code from './tabs/Code'
import Demo from './tabs/Demo'
import PropTypes from 'prop-types'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Instructions from './tabs/Instructions'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props
  const showPanel = value === index
  return showPanel ? (
    <div hidden={!showPanel} {...other}>
      {value === index && <div>{children}</div>}
    </div>
  ) : null
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

export default function BasicTabs({ challenge }) {
  const [tab, setTab] = React.useState(0)

  const handleChange = (event, newValue) => {
    setTab(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleChange}>
          <Tab label='Instructions' />
          <Tab label='Code' />
          <Tab label='Demo / Solution' />
        </Tabs>
      </Box>
      <CustomTabPanel value={tab} index={0}>
        <Instructions challenge={challenge} />
      </CustomTabPanel>
      <CustomTabPanel
        value={tab}
        index={1}
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Code challenge={challenge} />
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={2}>
        <Demo challenge={challenge} />
      </CustomTabPanel>
    </Box>
  )
}
