import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useLocation } from 'react-router-dom'
import headerTexts from './headerText'

const Heading = () => {
  const [headerText, setHeaderText] = useState('')
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/workouts') {
      setHeaderText(headerTexts.official)
    } else if (location.pathname === '/workouts/community') {
      setHeaderText(headerTexts.community)
    } else if (location.pathname === '/workouts/your-workouts') {
      setHeaderText(headerTexts.yourWorkouts)
    }
  }, [location.pathname])

  return (
    <Box>
      <Typography variant='h5' color='grey.400'>
        {headerText.title}
      </Typography>
      <Typography variant='subtitle1' color='grey.600'>
        {headerText.subtitle}
      </Typography>
    </Box>
  )
}

export default Heading
