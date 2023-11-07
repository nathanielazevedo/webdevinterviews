import { useState } from 'react'

export default function App() {
  const [switchStatus, setSwitchStatus] = useState(0)
  console.log(switchStatus)
  return (
    <div className={`${switchStatus ? 'barOn' : 'barOff'} bar`}>
      <div
        className={`${switchStatus ? 'on' : 'off'} ball`}
        onClick={() => setSwitchStatus(!switchStatus)}
      ></div>
    </div>
  )
}
