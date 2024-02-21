import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AuthContext } from '../../../contexts/AuthContext'
import { useContext } from 'react'
import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import DialogActions from '@mui/material/DialogActions'
import CircularProgress from '@mui/material/CircularProgress'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
} from '@mui/material'

const schema = yup.object().shape({
  email: yup.string().email().required(),
})

const ResendVerificationDialog = ({ open, handleClose, email }) => {
  const { handleResendVerificationCode } = useContext(AuthContext)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    // handle resend verification code
    setLoadingDelete(true)
    try {
      await handleResendVerificationCode(data.email)
      setIsCodeSent(true)
    } catch (err) {
      console.error(err)
    }
    setLoadingDelete(false)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white',
        }}
      >
        Resend Verification Code
        <IconButton
          edge='end'
          color='inherit'
          onClick={handleClose}
          aria-label='close'
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isCodeSent ? (
          <Typography variant='body1'>
            Code has been sent, check your email.
          </Typography>
        ) : (
          <>
            <Typography variant='body1' color={'grey.400'}>
              A code will be sent to this email address.
            </Typography>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ margin: '1rem 0' }}
            >
              <Controller
                name='email'
                control={control}
                defaultValue={email || ''}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    label='Email'
                    variant='outlined'
                    fullWidth
                  />
                )}
              />
            </form>
          </>
        )}
      </DialogContent>
      {isCodeSent ? null : (
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 20px 20px 20px',
          }}
        >
          <Button onClick={handleClose} variant='contained'>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant='contained'
            disabled={loadingDelete}
          >
            {loadingDelete ? (
              <CircularProgress
                size={24}
                sx={{
                  color: 'primary',
                }}
              />
            ) : (
              'Resend Code'
            )}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default ResendVerificationDialog
