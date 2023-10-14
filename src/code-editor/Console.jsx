import { useState, useEffect } from 'react'
import { Console, Hook, Unhook } from 'console-feed'
import { useSandpackConsole } from '@codesandbox/sandpack-react'
import { useSandpack } from '@codesandbox/sandpack-react'

const LogsContainer = () => {
  const { sandpack } = useSandpack()
  const { logs } = useSandpackConsole({
    clientId: Object.values(sandpack.clients)[0],
  })
  const [log, setLogs] = useState(logs)
  console.log('yo', log)

  // run once!
  useEffect(() => {
    const hookedConsole = Hook(
      logs,
      (log) => setLogs((currLogs) => [...currLogs, log]),
      false
    )
    return () => Unhook(hookedConsole)
  }, [])

  return <Console logs={log} style={{ border: 'solid red 1px' }} />
}

export default LogsContainer
