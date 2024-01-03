import { Box, Divider } from '@mui/material'
import { NavLink } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { useContext } from 'react'
import { StyledTopNav } from '../../../rootStyledComponents'
import { WorkoutContext } from '../root/WorkoutContext'

const TopNav = () => {
  const { workoutData } = useContext(WorkoutContext)

  return (
    <StyledTopNav>
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
        <Divider orientation='vertical' flexItem />
        <NavLink
          to={`/workouts/${workoutData.id}/manage/code`}
          replace
          className={({ isActive, isPending }) =>
            `nav-link tab-nav-link ${
              isActive ? 'active' : isPending ? 'pending' : 'not-active'
            }`
          }
        >
          <Typography sx={{ fontSize: '12px' }}>CODE VIEWER</Typography>
        </NavLink>
      </Box>
      <div style={{ flexGrow: '1' }} />
    </StyledTopNav>
  )
}

export default TopNav
