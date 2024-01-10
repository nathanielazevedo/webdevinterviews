import { Box, Divider } from '@mui/material'
import { NavLink } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { StyledTopNav } from '../../../rootStyledComponents'

const isDev = import.meta.env.DEV

const TopNav = () => (
  <StyledTopNav>
    <Box
      sx={{
        display: 'flex',
        gap: '20px',
      }}
    >
      <NavLink
        to='/workouts/official'
        end
        className={({ isActive, isPending }) =>
          `nav-link tab-nav-link ${
            isActive ? 'active' : isPending ? 'pending' : 'not-active'
          }`
        }
      >
        <Typography sx={{ fontSize: '12px' }}>OFFICIAL</Typography>
      </NavLink>
      {/* <Divider orientation='vertical' flexItem />
      <NavLink
        to='/workouts/community'
        className={({ isActive, isPending }) =>
          `nav-link tab-nav-link ${
            isActive ? 'active' : isPending ? 'pending' : 'not-active'
          }`
        }
      >
        <Typography sx={{ fontSize: '12px' }}>COMMUNITY</Typography>
      </NavLink> */}
      {isDev && (
        <>
          <Divider orientation='vertical' flexItem />
          <NavLink
            to='/workouts/your-workouts'
            className={({ isActive, isPending }) =>
              `nav-link tab-nav-link ${
                isActive ? 'active' : isPending ? 'pending' : 'not-active'
              }`
            }
          >
            <Typography sx={{ fontSize: '12px' }}>YOUR WORKOUTS</Typography>
          </NavLink>
        </>
      )}
    </Box>
    <div style={{ flexGrow: '1' }} />
  </StyledTopNav>
)

export default TopNav
