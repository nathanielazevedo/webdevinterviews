/* eslint-disable react/prop-types */
import { Console } from 'console-feed'
import { Typography } from '@mui/material'
import { useSandpackConsole } from '@codesandbox/sandpack-react'

const LogsContainer = () => {
  const { logs } = useSandpackConsole({})

  return (
    <>
      <Typography
        fontSize={'small'}
        sx={{
          padding: '5px 0px 5px 10px',
          color: '#C5C5C5',
          borderBottom: '0.5px solid var(--color-solid-resize-bar)',
        }}
      >
        Console {`(${logs.length})`}
      </Typography>
      <Console logs={logs} variant='dark' />
    </>
  )
}

export default LogsContainer
