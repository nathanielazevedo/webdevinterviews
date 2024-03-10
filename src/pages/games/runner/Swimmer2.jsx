/* eslint-disable react/no-unescaped-entities */
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
        height: 'calc(100vw * 9 / 16)',
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
          gap: '15px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant='h4' sx={{ color: 'black', fontWeight: 'bold' }}>
            JavaSwim
          </Typography>
          <Typography variant='subtitle1' sx={{ color: 'black' }}>
            Swim over the shark if you think it's true, swim under if you think
            it's false.
          </Typography>
        </div>
        <Button
          variant='contained'
          onClick={() => {
            console.log('play game')
            initializeGame(() => {})
          }}
          style={{ zIndex: 1000, width: '100px' }}
        >
          Play
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
          color: 'black',
        }}
      >
        <Typography
          id='question'
          variant='h6'
          sx={{ color: 'black', fontWeight: 'bold' }}
        ></Typography>
      </div>
      <div
        id='startOverButton'
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2000,
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          color: 'black',
        }}
      >
        <Typography variant='h4' fontWeight={'bold'}>
          Game Over
        </Typography>
        <Typography id='scoreSpot' variant='h5'></Typography>
        <Button variant='contained'>Play Again</Button>
      </div>
    </div>
  )
}

export default GameComponent
