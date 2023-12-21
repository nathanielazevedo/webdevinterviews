import { Box, Button, Divider } from '@mui/material'
import { NavLink } from 'react-router-dom'
import TuneIcon from '@mui/icons-material/Tune'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import { useContext } from 'react'
import { StyledTopNav } from '../../../rootStyledComponents'
import WorkoutContext from '../root/WorkoutContext'

const TopNav = ({ open, setOpen }) => {
  const { workoutData } = useContext(WorkoutContext)
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
          <Typography sx={{ fontSize: '12px' }}>MANAGE CODE</Typography>
        </NavLink>
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
