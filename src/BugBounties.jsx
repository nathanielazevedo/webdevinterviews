import PestControlOutlinedIcon from '@mui/icons-material/PestControlOutlined'
import { Box, Typography } from '@mui/material'

const BugBounties = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '200px',
        gap: '50px',
      }}
    >
      <PestControlOutlinedIcon
        sx={{
          height: '300px',
          width: '300px',
          color: '#19e4ff',
        }}
      />
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          flexDirection: 'column',
        }}
      >
        <Typography variant='h5'>What's a bug bounty?</Typography>
        <Typography
          variant='h3'
          sx={{
            color: '#19e4ff',
          }}
        >
          Win money for smashing bugs.{' '}
        </Typography>
        <Typography variant='h5' mt={3}>
          Yeah, that's right.
        </Typography>
        <Typography
          variant='h3'
          sx={{
            color: '#19e4ff',
          }}
        >
          Subscribe.
        </Typography>
      </Box>
    </Box>
  )
}

export default BugBounties
