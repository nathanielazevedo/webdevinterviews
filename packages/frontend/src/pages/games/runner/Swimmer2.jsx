/* eslint-disable react/no-unescaped-entities */
import { initializeGame } from './gameLogic.js'
import { useState } from 'react'
import {
  Button,
  CircularProgress,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import './runner.css'
import useFetch from '../../../hooks/useFetch.jsx'
import useApi from '../../../hooks/useApi.jsx'

const GameComponent = () => {
  const { data: scores, loading, setData } = useFetch('/scores')
  const [newHighScore, setNewHighScore] = useState(null)
  const [name, setName] = useState('')
  const { postIt } = useApi()

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100vw',
          height: 'calc(100vw * 9 / 16)',
        }}
      >
        <Typography>Game Loading...</Typography>
        <CircularProgress />
      </div>
    )
  }

  const returnScore = (newScore) => {
    scores.forEach((score) => {
      if (newScore > score.score) {
        setNewHighScore(newScore)
        return
      }
    })
  }

  const handleInput = (evt) => {
    const val = evt.target.value
    if (val.length > 4) return
    setName(evt.target.value)
  }

  const CustomTable = () => {
    return (
      <>
        <Typography variant='subtitle1' sx={{ fontSize: '10px !important' }}>
          Top 5 Scores:
        </Typography>
        <Table size='small' sx={{ fontSize: '10px !important' }}>
          <TableHead sx={{ padding: 0, margin: 0 }}>
            <TableCell sx={{ fontSize: '10px !important', padding: '0 5px' }}>
              Rank
            </TableCell>
            <TableCell sx={{ fontSize: '10px !important', padding: 0 }}>
              Score
            </TableCell>
            <TableCell sx={{ fontSize: '10px !important', padding: 0 }}>
              Name
            </TableCell>
          </TableHead>
          {scores
            .sort((a, b) => b.score - a.score)
            .map((score, index) => {
              return (
                <TableRow
                  key={index}
                  sx={{
                    fontSize: '10px !important',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <TableCell
                    variant='caption'
                    sx={{
                      fontSize: '10px !important',
                      padding: '0 5px',
                      margin: 0,
                    }}
                  >
                    {index}
                  </TableCell>
                  <TableCell
                    variant='caption'
                    sx={{ fontSize: '10px !important', padding: 0, margin: 0 }}
                  >
                    {score.score}
                  </TableCell>
                  <TableCell
                    variant='caption'
                    sx={{ fontSize: '10px !important', padding: 0, margin: 0 }}
                  >
                    {score.display_name}{' '}
                  </TableCell>
                </TableRow>
              )
            })}
        </Table>
      </>
    )
  }

  const submitHighScore = async () => {
    const response = await postIt('/scores', {
      display_name: name,
      score: newHighScore,
    })
    setNewHighScore(null)
    setData(response.data)
    setName('')
  }

  return (
    <div
      style={{
        width: '100vw',
        // height: 'calc(100vw * 9 / 16)',
        position: 'relative',
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
          backgroundColor: 'lightblue',
          // backgroundImage: `url(${background})`,
          // backgroundSize: '100% 100%',
          gap: '0px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            width: '350px',
            textAlign: 'center',
          }}
        >
          <Typography
            variant='subtitle1'
            sx={{ color: 'black', fontWeight: 'bold' }}
          >
            JavaSwim
          </Typography>
          <Typography variant='caption' sx={{ color: 'black', lineHeight: 1 }}>
            Swim over the shark if you think it's true, swim under if you think
            it's false.
          </Typography>
          <Button
            variant='contained'
            size='small'
            onClick={() => {
              console.log('play game')
              initializeGame(returnScore)
            }}
            style={{ zIndex: 1000, width: '100px' }}
          >
            Play
          </Button>
          <div
            className='high-scores'
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,100)',
              borderRadius: '10px',
              padding: '0px 0',
              marginTop: '3px',
            }}
          >
            <CustomTable />
          </div>
        </div>
      </div>

      <canvas id='gameCanvas'></canvas>

      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
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
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2000,
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0px',
          color: 'black',
        }}
      >
        <Typography variant='subtitle1' fontWeight={'bold'}>
          Game Over
        </Typography>
        <Typography id='scoreSpot' variant='subtitle1'></Typography>
        <Button
          variant='contained'
          size='small'
          id='playAgain'
          onClick={() => setNewHighScore(null)}
        >
          Play Again
        </Button>
        <div
          className='high-scores'
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,100)',
            borderRadius: '10px',
            padding: '5px 5px',
            marginTop: '5px',
            color: 'white',
            width: '350px',
          }}
        >
          {newHighScore && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '3px',
                width: '350px',
              }}
            >
              <Typography variant='caption'>New High Score.</Typography>
              <div>
                <input
                  placeholder='Display Name'
                  onChange={(evt) => handleInput(evt)}
                  value={name}
                ></input>
                <Typography sx={{ fontSize: '8px' }}>Max characters</Typography>
              </div>
              <button onClick={submitHighScore}>Submit</button>
            </div>
          )}
          <CustomTable />
        </div>
      </div>
    </div>
  )
}

export default GameComponent
