import Box from '@mui/material/Box'

const WorkoutSkeleton = () => {
  return (
    <Box
      id='base'
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        id='containers'
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          borderRadius: '10px',
          flexDirection: 'column',
        }}
      >
        <Box
          id='top-nav'
          sx={{
            height: '50px',
            width: '100%',
            borderBottom: '0.5px solid var(--divider)',
          }}
        />
        <Box
          id='main'
          sx={{
            flexGrow: 1,
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box
            id='side-nav'
            sx={{
              borderRight: '0.5px solid var(--divider)',
              height: '100%',
              width: '60px',
            }}
          />
          <Box id='main-content' />
        </Box>
      </Box>
    </Box>
  )
}

export default WorkoutSkeleton
