import Typography from '@mui/material/Typography'
import ScoreCircles from './ScoreCircles'

const GameHead = ({ title, length, scores }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography sx={{ color: 'grey.500' }}>{title}</Typography>
      <ScoreCircles length={length} scores={scores} />
    </div>
  )
}

export default GameHead
