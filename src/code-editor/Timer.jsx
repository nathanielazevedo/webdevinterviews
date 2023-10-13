import { useState, useEffect } from 'react'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import HistoryIcon from '@mui/icons-material/History'
import { Tooltip } from '@mui/material'

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
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <div style={{ marginRight: '0.5rem' }}>
          {minutes < 10 ? `0${minutes}` : minutes}
        </div>
        <div style={{ marginRight: '0.5rem' }}>:</div>
        <div style={{ marginRight: '0.5rem' }}>
          {seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginLeft: '0.5rem',
        }}
      >
        <Tooltip
          onClick={handlePause}
          title={isPaused ? 'Start Timer' : 'Pause Timer'}
          style={{ cursor: 'pointer' }}
        >
          {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
        </Tooltip>
        <Tooltip
          onClick={handleReset}
          title='Reset Timer'
          style={{ cursor: 'pointer' }}
        >
          <HistoryIcon />
        </Tooltip>
      </div>
    </div>
  )
}

export default Timer
