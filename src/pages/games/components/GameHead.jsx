import Typography from '@mui/material/Typography'
import ScoreCircles from './ScoreCircles'

const GameHead = ({ title, length, scores }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography sx={{ color: 'grey.400' }}>{title}</Typography>
      <ScoreCircles length={length} scores={scores} />
    </div>
  )
}

export default GameHead
