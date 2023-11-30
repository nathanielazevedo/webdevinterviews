import Box from '@mui/material/Box'
import { useContext } from 'react'
import { LogContext } from '../../pages/LogContext' // Replace with the actual path to LogContext
import { Typography } from '@mui/material'
import { useEffect } from 'react'
import { useState } from 'react'
import Fade from '@mui/material/Fade'

const Footer = () => {
  const { logs, addLog } = useContext(LogContext)
  const latestLog = logs[logs.length - 1]

  useEffect(() => {
    const timer = setTimeout(() => {
      addLog('')
    }, 5000)

    return () => clearTimeout(timer)
  }, [latestLog, addLog])

  const [key, setKey] = useState(0)

  useEffect(() => {
    setKey((prevKey) => prevKey + 1)
  }, [latestLog])

  return (
    <Box
      sx={{
        height: '25px',
        borderTop: '0.5px solid #454950',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '0 16px',
      }}
    >
      <Fade in={true} key={key}>
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '0 10px',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              color: 'black',
            }}
          >
            {latestLog}
          </Typography>
        </Box>
      </Fade>
    </Box>
  )
}

export default Footer
