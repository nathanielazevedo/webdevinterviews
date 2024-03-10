import * as React from 'react'
import { initializeGame } from './gameLogic.js'
import { Button, Typography } from '@mui/material'
import background from './background.png'
import './runner.css'

function GameComponent() {
  return (
    <div
      style={{
        width: '100vw',
        height: '300px',
        position: 'relative',
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
        <Button
          variant='contained'
          onClick={() => {
            console.log('play game')
            initializeGame(() => {})
          }}
          style={{ zIndex: 1000 }}
        >
          Play Game
        </Button>
      </div>
      <canvas id='gameCanvas'></canvas>
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <Typography
          id='question'
          variant='h6'
          sx={{ color: 'black', fontWeight: 'bold' }}
        ></Typography>
        <Button
          id='startOverButton'
          variant='contained'
          style={{
            display: 'none',
          }}
        >
          New Game
        </Button>
      </div>
    </div>
  )
}

export default GameComponent
