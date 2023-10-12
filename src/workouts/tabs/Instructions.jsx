import { Typography } from '@mui/material'

/* eslint-disable react/prop-types */
const Description = ({ challenge }) => {
  return (
    <>
      <Typography>{challenge.description}</Typography>
    </>
  )
}

export default Description
