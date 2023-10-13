import { Typography, Box, Checkbox } from '@mui/material'

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
