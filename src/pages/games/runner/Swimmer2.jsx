import React, { useEffect } from 'react'
import { initializeGame } from './gameLogic.js'
import { Button, Typography } from '@mui/material'

function GameComponent() {
  useEffect(() => {
    initializeGame((answer) => console.log(answer))
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <canvas id='gameCanvas' width={800} height={300}></canvas>
      <Button
        id='startOverButton'
        variant='contained'
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        Start Over
      </Button>
      <Typography
        id='question'
        sx={{
          position: 'absolute',
          color: 'black',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontWeight: 'bold',
        }}
      ></Typography>
    </div>
  )
}

export default GameComponent
