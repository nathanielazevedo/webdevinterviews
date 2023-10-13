import { Typography } from '@mui/material'
import { Box } from '@mui/system'

/* eslint-disable react/prop-types */
const Description = ({ challenge }) => {
  return (
    <Box
      pl={2}
      pr={2}
      gap={'40px'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Typography>{challenge.description}</Typography>
      {challenge.gif && (
        <img
          src={challenge.gif}
          alt={challenge.name}
          style={{ maxWidth: '30%' }}
        />
      )}
      {challenge.checkList.map((item, index) => (
        <Typography key={index} variant='body1'>
          {item}
        </Typography>
      ))}
    </Box>
  )
}

export default Description
