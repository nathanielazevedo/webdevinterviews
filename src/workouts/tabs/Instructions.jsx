import { Typography, Box, Checkbox } from '@mui/material'

/* eslint-disable react/prop-types */
const Description = ({ challenge }) => {
  return (
    <Box
      gap={'40px'}
      zIndex={1000}
      id='instructions'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        posiiton: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
      }}
    >
      {challenge.gif && (
        <img
          src={challenge.gif}
          alt={challenge.name}
          style={{ maxWidth: '30%' }}
        />
      )}
      <Typography>{challenge.description}</Typography>
      <Box>
        <Typography variant='h6' color='primary'>
          Checklist
        </Typography>
        {challenge.checkList.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Checkbox />
            <Typography key={index} variant='body1'>
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Description
