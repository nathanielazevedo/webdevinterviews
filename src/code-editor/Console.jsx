/* eslint-disable react/prop-types */
import { Console } from 'console-feed'
import { useSandpackConsole } from '@codesandbox/sandpack-react'

const LogsContainer = () => {
  const { logs } = useSandpackConsole({})

  return <Console logs={logs} variant='dark' />
}

export default LogsContainer
