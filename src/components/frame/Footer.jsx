import Box from '@mui/material/Box'
import { useContext } from 'react'
import { LogContext } from '../../pages/LogContext' // Replace with the actual path to LogContext

const Footer = () => {
  const { logs } = useContext(LogContext)
  const latestLog = logs[logs.length - 1]
  return (
    <Box
      sx={{
        height: '25px',
        borderTop: '0.5px solid #454950',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 10px',
      }}
    >
      <div></div>
      <div>{latestLog}</div>
    </Box>
  )
}

export default Footer
