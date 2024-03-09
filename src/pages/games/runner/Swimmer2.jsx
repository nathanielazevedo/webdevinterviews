import React, { useEffect } from 'react'
import { initializeGame } from './gameLogic.js'
import { Button, Typography } from '@mui/material'
import background from './background.png'

function GameComponent() {
  useEffect(() => {
    // drawBg()
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        width: '500px',
        height: '300px',
      }}
    >
      <div
        id='intro-screen'
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundImage: `url(${background})`,
          backgroundSize: '100% 100%',
          gap: '25px',
        }}
      >
        <Typography variant='h4' sx={{ color: 'black' }}>
          JavaSwim
        </Typography>
        <Button variant='contained' onClick={() => initializeGame(() => {})}>
          Play Game
        </Button>
      </div>
      <canvas id='gameCanvas' width={500} height={300}></canvas>
      <Button
        id='startOverButton'
        variant='contained'
        style={{
          position: 'absolute',
          display: 'none',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        New Game
      </Button>
      <Typography
        id='question'
        sx={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontWeight: 'bold',
          color: 'black',
        }}
      ></Typography>
    </div>
  )
}

export default GameComponent
