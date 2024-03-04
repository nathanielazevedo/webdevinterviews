import CloseIcon from '@mui/icons-material/Close'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import { Fade } from '@mui/material'

const ScoreCircles = ({ length, scores }) => {
  const getThing = (score) => {
    if (score == undefined) {
      return ''
    } else if (score) {
      return (
        <Fade in={true} timeout={1500}>
          <CheckOutlinedIcon color='success' />
        </Fade>
      )
    } else {
      return (
        <Fade in={true} timeout={1500}>
          <CloseIcon color='error' />
        </Fade>
      )
    }
  }
  return (
    <div className='score-circles-container'>
      {Array(length)
        .fill()
        .map((_, index) => {
          return <div key={index}>{getThing(scores[index])}</div>
        })}
    </div>
  )
}

export default ScoreCircles
