import { useState, useEffect } from 'react'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import HistoryIcon from '@mui/icons-material/History'
import { Tooltip, Typography } from '@mui/material'

const Timer = () => {
  const [minutes, setMinutes] = useState(45)
  const [seconds, setSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(true)

  useEffect(() => {
    let interval

    if (!isPaused) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else if (minutes > 0) {
          setMinutes(minutes - 1)
          setSeconds(59)
        }
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isPaused, minutes, seconds])

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleReset = () => {
    setMinutes(45)
    setSeconds(0)
    setIsPaused(true)
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#C5C5C5',
          width: '75px',
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
          display: 'flex',
          gap: '5px',
          marginLeft: '10px',
        }}
      >
        <Tooltip
          onClick={handlePause}
          title={isPaused ? 'Start Timer' : 'Pause Timer'}
          style={{ cursor: 'pointer' }}
        >
          {isPaused ? (
            <PlayArrowIcon
              fontSize='small'
              sx={{
                color: '#C5C5C5',
              }}
            />
          ) : (
            <PauseIcon
              fontSize='small'
              sx={{
                color: '#C5C5C5',
              }}
            />
          )}
        </Tooltip>
        <Tooltip
          onClick={handleReset}
          title='Reset Timer'
          style={{ cursor: 'pointer' }}
        >
          <HistoryIcon
            fontSize='small'
            sx={{
              color: '#C5C5C5',
            }}
          />
        </Tooltip>
      </div>
    </div>
  )
}

export default Timer
