import { Button } from '@mui/material'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import { useState } from 'react'
import SubmitDialog from '../../pages/workout/dialogs/SubmitDialog'

const Submit = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        sx={{
          position: 'absolute',
          top: '2px',
          right: '30px',
          cursor: 'pointer',
          zIndex: '100',
        }}
        onClick={() => setOpen(true)}
      >
        <ManageAccountsIcon />
      </Button>
      <SubmitDialog open={open} setOpen={setOpen} />
    </>
  )
}

export default Submit
