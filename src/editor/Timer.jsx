import { useState, useEffect } from 'react'
import PauseIcon from '@mui/icons-material/Pause'
import { Tooltip, Typography } from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

const Timer = () => {
  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(45)
  const [isPaused, setIsPaused] = useState(true)

  useEffect(() => {
    let interval
    if (!isPaused) {
      interval = setInterval(() => {
        if (seconds > 0) setSeconds(seconds - 1)
        else if (minutes > 0) {
          setMinutes(minutes - 1)
          setSeconds(59)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPaused, minutes, seconds])

  const handleReset = () => {
    setMinutes(45)
    setSeconds(0)
    setIsPaused(true)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '75px',
          display: 'flex',
          color: '#C5C5C5',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography fontSize='small' style={{ marginRight: '7px' }}>
          {minutes < 10 ? `0${minutes}` : minutes}
        </Typography>
        <div>:</div>
        <Typography fontSize='small' style={{ marginLeft: '7px' }}>
          {seconds < 10 ? `0${seconds}` : seconds}
        </Typography>
      </div>
      <div
        style={{
          gap: '5px',
          display: 'flex',
          marginLeft: '10px',
        }}
      >
        <Tooltip
          style={{ cursor: 'pointer' }}
          onClick={() => setIsPaused(!isPaused)}
          title={isPaused ? 'Start Timer' : 'Pause Timer'}
        >
          {isPaused ? (
            <PlayArrowIcon fontSize='small' sx={{ color: '#C5C5C5' }} />
          ) : (
            <PauseIcon fontSize='small' sx={{ color: '#C5C5C5' }} />
          )}
        </Tooltip>
        <Tooltip
          title='Reset Timer'
          onClick={handleReset}
          style={{ cursor: 'pointer' }}
        >
          <HistoryIcon fontSize='small' sx={{ color: '#C5C5C5' }} />
        </Tooltip>
      </div>
    </div>
  )
}

export default Timer
