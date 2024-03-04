import { Typography, Zoom } from '@mui/material'
import FireWorks from '../../../components/fireworks/Fireworks'
import {
  SandpackCodeEditor,
  SandpackProvider,
} from '@codesandbox/sandpack-react'
import { amethyst } from '@codesandbox/sandpack-themes'
import CloseIcon from '@mui/icons-material/Close'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'

const Screen = ({ output, code, gameOver, currentScore, deckLength }) => {
  const perfectScore = currentScore == deckLength

  const getGameOverText = () => {
    const score = (currentScore / deckLength) * 100
    console.log(score)
    if (score > 80) {
      return "You're master at this!"
    } else if (score > 65) {
      return 'You did alright.'
    } else {
      return 'Go back to the gym!'
    }
  }

  const getScreen = () => {
    if (gameOver) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant='subtitle1' sx={{ color: 'grey.300' }}>
            {getGameOverText()}
          </Typography>
          <Typography
            sx={{ color: 'grey.300', fontSize: '45px' }}
            className='score'
          >
            {currentScore} / {deckLength}
          </Typography>
        </div>
      )
    } else if (output !== null) {
      return (
        <div className='output-container'>
          <Typography variant='h4'>
            {output ? (
              <Zoom in={true}>
                <CheckOutlinedIcon
                  color='success'
                  sx={{ fontSize: '70px' }}
                  className='thing'
                />
              </Zoom>
            ) : (
              <Zoom in={true}>
                <CloseIcon
                  color='error'
                  sx={{ fontSize: '70px' }}
                  className='thing'
                />
              </Zoom>
            )}
          </Typography>
        </div>
      )
    } else {
      return (
        <Zoom in={true}>
          <div>
            <SandpackProvider
              theme={{
                ...amethyst,
                font: { size: '20px', lineHeight: '30px' },
                syntax: {
                  tag: '#5833ff',
                  static: '#6cbdf7',
                },
              }}
              files={{ '/index.js': code }}
            >
              <SandpackCodeEditor
                readOnly
                showReadOnly={false}
                style={{ width: '100%' }}
                wrapContent
              />
            </SandpackProvider>
          </div>
        </Zoom>
      )
    }
  }
  return (
    <div className='code-container'>
      {getScreen()}
      {perfectScore && <FireWorks />}
    </div>
  )
}

export default Screen
