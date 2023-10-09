/* eslint-disable react/prop-types */

import { Box } from '@mui/material'

const Video = ({ video }) => {
  return (
    <Box
      sx={{
        border: 'solid grey 1px',
        borderRadius: '10px',
        padding: '10px',
      }}
    >
      <img
        src='https://img.youtube.com/vi/DhF1SJ5WUlY/0.jpg'
        width='200px'
        style={{ borderRadius: '10px', border: 'solid grey 1px' }}
      />
      {video.title}
    </Box>
  )
}

export default Video
