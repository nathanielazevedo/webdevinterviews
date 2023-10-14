import { useState, useEffect } from 'react'
import { Console, Hook, Unhook } from 'console-feed'
import { useSandpackConsole } from '@codesandbox/sandpack-react'

const LogsContainer = () => {
  const [logs, setLogs] = useState([])
  const { logss } = useSandpackConsole()
  console.log('this is running')

  // run once!
  useEffect(() => {
    const hookedConsole = Hook(
      logss,
      (log) => setLogs((currLogs) => [...currLogs, log]),
      false
    )
    return () => Unhook(hookedConsole)
  }, [])

  return (
    <Console logs={logs} variant='dark' style={{ border: 'solid red 1px' }} />
  )
}

export default LogsContainer
