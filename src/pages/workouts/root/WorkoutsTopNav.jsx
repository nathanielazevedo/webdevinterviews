import { Box, Button, Divider } from '@mui/material'
import { NavLink } from 'react-router-dom'
import TuneIcon from '@mui/icons-material/Tune'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import { StyledTopNav } from '../../../rootStyledComponents'

const TopNav = ({ open, setOpen }) => {
  const filter = 'all'
  return (
    <StyledTopNav>
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
        }}
      >
        <NavLink
          to='/workouts'
          end
          className={({ isActive, isPending }) =>
            `nav-link tab-nav-link ${
              isActive ? 'active' : isPending ? 'pending' : 'not-active'
            }`
          }
        >
          <Typography sx={{ fontSize: '12px' }}>OFFICIAL</Typography>
        </NavLink>
        <Divider orientation='vertical' flexItem />
        <NavLink
          to='/workouts/community'
          className={({ isActive, isPending }) =>
            `nav-link tab-nav-link ${
              isActive ? 'active' : isPending ? 'pending' : 'not-active'
            }`
          }
        >
          <Typography sx={{ fontSize: '12px' }}>COMMUNITY</Typography>
        </NavLink>
        <Divider orientation='vertical' flexItem />
        {/* <NavLink
          to='/workouts/your-workouts'
          className={({ isActive, isPending }) =>
            `nav-link tab-nav-link ${
              isActive ? 'active' : isPending ? 'pending' : 'not-active'
            }`
          }
        >
          <Typography sx={{ fontSize: '12px' }}>YOUR WORKOUTS</Typography>
        </NavLink> */}
      </Box>
      <div style={{ flexGrow: '1' }} />
      {/* <Button
        size='small'
        startIcon={<TuneIcon />}
        onClick={() => setOpen(!open)}
      >
        FILTER
      </Button> */}
    </StyledTopNav>
  )
}

export default TopNav

TopNav.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}
