/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Button } from '@mui/material'
import Alert from '../Alert'

const ResetChanges = ({ changedFiles }) => {
  const [showWarning, setShowWarning] = useState(false)
  return (
    <>
      <Button
        onClick={() => setShowWarning(true)}
        size='small'
        color='inherit'
        fullWidth
      >
        RESET CHANGES
      </Button>
      {showWarning && <Alert setOpen={setShowWarning} />}
    </>
  )
}

export default ResetChanges
