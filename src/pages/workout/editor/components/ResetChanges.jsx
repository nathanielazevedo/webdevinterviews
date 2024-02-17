/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Button } from '@mui/material'
import Alert from '../Alert'

const ResetChanges = ({ changedFiles }) => {
  const [showWarning, setShowWarning] = useState(false)
  return (
    <>
      <Button
        variant='outlined'
        onClick={() => setShowWarning(true)}
        size='small'
        color='error'
        fullWidth
        sx={{ mt: 1 }}
        disabled={changedFiles?.length === 0}
      >
        RESET CHANGES
      </Button>
      {showWarning && <Alert setOpen={setShowWarning} />}
    </>
  )
}

export default ResetChanges
