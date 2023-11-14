import Box from '@mui/material/Box'
// import { Form } from 'react-router-dom'
import FilterListIcon from '@mui/icons-material/FilterList'

const TopNav = () => {
  return (
    <Box
      sx={{
        height: '35px',
        width: '100%',
        borderBottom: '0.5px solid var(--color-solid-resize-bar-handle)',
        display: 'flex',
        alignItems: 'center',
        padding: '0px 25px',
        // justifyContent: 'center',
      }}
    >
      <FilterListIcon sx={{ color: 'grey.500' }} />
      {/* <Typography color='grey.500'>WORKOUTS</Typography> */}
      <div style={{ flexGrow: '1' }} />
      {/* <Form
        style={{
          marginLeft: '20px',
          borderBottom: '1px solid var(--color-solid-resize-bar-handle)',
          width: '230px',
        }}
      >
        <input
          placeholder='Search for workout by name'
          style={{
            backgroundColor: 'transparent',
            width: '100%',
            color: 'white',
            border: 'none',
          }}
        />
      </Form> */}
    </Box>
  )
}

export default TopNav
