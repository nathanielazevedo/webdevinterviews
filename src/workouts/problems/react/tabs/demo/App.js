const tabs = ['TAB 1', 'TAB 2', 'TAB 3']
const panels = ['Panel 1', 'Panel 2', 'Panel 3']
import { useState } from 'react'
import Tab from './Tab'
import Panel from './Panel'

export default function App() {
  const [currTab, setCurrTab] = useState(0)

  const handleTabChange = (tab) => {
    setCurrTab(tab)
  }

  return (
    <div>
      <div className='tabs-container'>
        {tabs.map((tab, index) => {
          return (
            <Tab
              key={index}
              tab={tab}
              onClick={() => handleTabChange(index)}
              active={currTab === index}
            />
          )
        })}
      </div>
      <div style={{ paddingTop: '15px' }}>
        {panels.map((panel, index) => {
          return <Panel key={index} tab={currTab} index={index} panel={panel} />
        })}
      </div>
    </div>
  )
}
