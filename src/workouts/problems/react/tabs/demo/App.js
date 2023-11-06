import { useState } from 'react'
import Panel from './Panel'

export default function App() {
  const [currTab, setCurrTab] = useState(0)

  return (
    <div className='container'>
      <div className='tabs-container'>
        {['TAB 1', 'TAB 2', 'TAB 3'].map((tab, index) => (
          <div
            key={tab}
            className='tab'
            onClick={() => setCurrTab(index)}
            style={{
              borderBottom:
                index == currTab ? 'blue 2px solid' : 'black 1px solid',
            }}
          >
            <b
              style={{
                color: index == currTab ? 'blue' : 'black',
              }}
            >
              {tab}
            </b>
          </div>
        ))}
      </div>

      <Panel currTab={currTab} index={0}>
        Panel One
      </Panel>
      <Panel currTab={currTab} index={1}>
        Panel Two
      </Panel>
      <Panel currTab={currTab} index={2}>
        Panel Three
      </Panel>
    </div>
  )
}
