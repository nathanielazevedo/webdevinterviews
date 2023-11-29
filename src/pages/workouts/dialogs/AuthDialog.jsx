/* eslint-disable react/prop-types */
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { NavLink } from 'react-router-dom'

const AuthDialog = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
        You need to login or signup to access this workout.
      </DialogTitle>
      <DialogContent>
        <Button
          component={NavLink}
          to='/auth/login'
          color='primary'
          variant='contained'
          fullWidth
        >
          Login
        </Button>
        <Button
          component={NavLink}
          to='/auth/signup'
          color='secondary'
          variant='contained'
          fullWidth
        >
          Signup
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AuthDialog
