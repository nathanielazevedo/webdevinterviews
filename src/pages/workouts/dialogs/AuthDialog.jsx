/* eslint-disable react/prop-types */
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { NavLink } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

const AuthDialog = ({ open, setOpen }) => (
  <Dialog open={open} onClose={() => setOpen(false)}>
    <DialogTitle
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      Access Denied
      <IconButton
        edge='end'
        color='inherit'
        onClick={() => setOpen(false)}
        aria-label='close'
        sx={{
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent>
      You need to login or signup to access this workout.
    </DialogContent>
    <DialogActions>
      <Button component={NavLink} to='/auth/signup' variant='contained'>
        Signup
      </Button>
      <Button
        component={NavLink}
        to='/auth/login'
        color='primary'
        variant='contained'
      >
        Login
      </Button>
    </DialogActions>
  </Dialog>
)

export default AuthDialog
