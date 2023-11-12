/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import LogoText from '../LogoText'
// import { useLocation } from 'react-router-dom'
import { Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import rows from '../../workouts/index'
import Rating from '../Rating'

const TopNav = ({ variant }) => {
  // const location = useLocation()
  const params = useParams()
  const workout = rows.find((row) => row.name === params.workoutName)

  const getContents = () => {
    switch (variant) {
      case 'editorNav':
        return (
          <Box
            sx={{
              display: 'flex',
              gap: '15px',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant='caption' color='primary.main'>
              WORKOUT #{workout.id} - {workout.title}
            </Typography>
            <Rating rating={workout.difficulty} />
          </Box>
        )
      case 'hidden':
        return null
      default:
        return (
          <>
            <LogoText />
            {/* <Typography variant='caption' color='grey.500' ml={'10px'}>
              {location.pathname}
            </Typography> */}
          </>
        )
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: variant === 'hidden' ? '0' : '35px',
        minHeight: variant === 'hidden' ? '0' : '35px',
        padding: '0px 20px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottom: '0.5px solid #454950',
        transition: 'height 0.5s ease-in-out',
      }}
    >
      {getContents()}
    </Box>
  )
}

export default TopNav
