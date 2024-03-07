import { Typography, Zoom } from '@mui/material'
import FireWorks from '../../../components/fireworks/Fireworks'
import {
  SandpackCodeEditor,
  SandpackProvider,
} from '@codesandbox/sandpack-react'
import { amethyst, githubLight } from '@codesandbox/sandpack-themes'
import CloseIcon from '@mui/icons-material/Close'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import { ColorModeContext } from '../../../Router'
import { useContext } from 'react'

const Screen = ({ output, code, gameOver, currentScore, deckLength }) => {
  const perfectScore = currentScore == deckLength
  const colorMode = useContext(ColorModeContext)
  const theme = colorMode.mode == 'dark' ? amethyst : githubLight
  const getGameOverText = () => {
    const score = (currentScore / deckLength) * 100
    if (score > 80) {
      return "You're a master at this!"
    } else if (score > 65) {
      return 'You did alright.'
    } else {
      return 'Go back to the gym!'
    }
  }

  const getScreen = () => {
    if (gameOver) {
      return (
        <Zoom in={true}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant='subtitle1' color='text.primary'>
              {getGameOverText()}
            </Typography>
            <Typography color={'text.secondary'} sx={{ fontSize: '45px' }}>
              {currentScore} / {deckLength}
            </Typography>
          </div>
        </Zoom>
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
                ...theme,
                colors: {
                  surface1: colorMode.mode == 'dark' ? '#121212' : 'white',
                },
                font: { size: '20px', lineHeight: '30px' },
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
