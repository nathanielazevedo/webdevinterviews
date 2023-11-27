import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material'

const UserDialog = ({ open, onClose, user }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>User Information</DialogTitle>
      <DialogContent>
        <Typography variant='body1'>
          <strong>Username:</strong> {user.Username}
        </Typography>
        <Typography variant='body1'>
          <strong>Email:</strong>{' '}
          {user.Attributes.find((attr) => attr.Name === 'email').Value}
        </Typography>
        {/* Add more fields as needed */}
      </DialogContent>
    </Dialog>
  )
}

export default UserDialog
