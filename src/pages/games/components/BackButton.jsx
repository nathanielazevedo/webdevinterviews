import Button from '@mui/material/Button'
import { ArrowBackIos } from '@mui/icons-material'

const BackButton = ({ disabled, goBack }) => {
  return (
    <Button
      disabled={disabled}
      onClick={goBack}
      size='small'
      startIcon={<ArrowBackIos />}
      sx={{ alignSelf: 'flex-start' }}
    >
      Previous
    </Button>
  )
}

export default BackButton
