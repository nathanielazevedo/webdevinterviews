import { Box } from '@mui/material'
import { NavLink } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { useContext } from 'react'
import { WorkoutContext } from '../../../contexts/WorkoutContext'

const TopNav = () => {
  const { workoutData } = useContext(WorkoutContext)

  return (
    <div className='top-nav'>
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
        }}
      >
        <NavLink
          to={`/workouts/${workoutData.id}/manage`}
          replace
          end
          className={({ isActive, isPending }) =>
            `nav-link tab-nav-link ${
              isActive ? 'active' : isPending ? 'pending' : 'not-active'
            }`
          }
        >
          <Typography sx={{ fontSize: '12px' }}>MANAGE META</Typography>
        </NavLink>
      </Box>
      <div style={{ flexGrow: '1' }} />
    </div>
  )
}

export default TopNav
