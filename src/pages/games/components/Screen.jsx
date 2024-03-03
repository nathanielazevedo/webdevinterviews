import { Typography } from '@mui/material'
import FireWorks from '../../../components/fireworks/Fireworks'

const ThumbUp = () => <>&#128077;</>
const ThumbDown = () => <>&#128078;</>

const Screen = ({ output, code, gameOver, currentScore, deckLength }) => {
  const perfectScore = currentScore == deckLength

  const getScreen = () => {
    if (gameOver) {
      return (
        <div>
          <Typography>Game Over.</Typography>
          <Typography>
            Score: {currentScore} / {deckLength}
          </Typography>
        </div>
      )
    } else if (output !== null) {
      return (
        <div className='output-container'>
          <Typography variant='h4'>
            {output ? <ThumbUp /> : <ThumbDown />}
          </Typography>
        </div>
      )
    } else {
      return (
        <p
          style={{
            fontFamily: 'monospace',
          }}
          dangerouslySetInnerHTML={{
            __html: code,
          }}
        ></p>
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
