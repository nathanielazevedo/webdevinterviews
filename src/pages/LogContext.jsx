/* eslint-disable react/prop-types */
import { createContext, useState } from 'react'
import { Encode } from 'console-feed'

export const LogContext = createContext()

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([])
  console.log('logs', logs)

  const addLog = (log) => {
    setLogs((prevLogs) => [...prevLogs, log])
  }

  return (
    <LogContext.Provider value={{ logs, addLog }}>
      {children}
    </LogContext.Provider>
  )
}
