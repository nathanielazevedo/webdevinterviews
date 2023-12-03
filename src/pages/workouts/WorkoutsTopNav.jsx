import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PropTypes from 'prop-types'
import { AuthContext } from '../AuthContext'
import { useContext } from 'react'
import Typography from '@mui/material/Typography'
import { StyledTopNav } from '../../styled'

const TopNav = ({ open, setOpenDialog }) => {
  const { isAdmin } = useContext(AuthContext)

  return (
    <StyledTopNav>
      <Typography
        component='div'
        color='grey.500'
        fontWeight={'bold'}
        sx={{
          fontSize: '10px',
        }}
      >
        WORKOUTS
      </Typography>
      <div style={{ flexGrow: '1' }} />
      {isAdmin && (
        <IconButton size='small' onClick={() => setOpenDialog(!open)}>
          <AddIcon
            size='small'
            sx={{
              color: 'primary.main',
            }}
          />
        </IconButton>
      )}
    </StyledTopNav>
  )
}

export default TopNav

TopNav.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpenDialog: PropTypes.func.isRequired,
}
