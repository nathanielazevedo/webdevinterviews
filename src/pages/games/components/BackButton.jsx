import Button from '@mui/material/Button'

const BackButton = ({ disabled, goBack }) => {
  return (
    <Button disabled={disabled} onClick={goBack}>
      Go Back
    </Button>
  )
}

export default BackButton
