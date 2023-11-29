import Box from '@mui/material/Box'
import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PropTypes from 'prop-types'
import { AuthContext } from '../AuthContext'
import { useContext } from 'react'

const TopNav = ({ open, setOpenDialog }) => {
  const { isAdmin } = useContext(AuthContext)

  return (
    <Box
      sx={{
        width: '100%',
        height: '35px',
        display: 'flex',
        padding: '0px 25px',
        alignItems: 'center',
        borderBottom: '0.5px solid var(--color-solid-resize-bar-handle)',
      }}
    >
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
    </Box>
  )
}

export default TopNav

TopNav.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpenDialog: PropTypes.func.isRequired,
}
