import { Box } from '@mui/material'
// import { useEffect, useState } from 'react'
import Video from './Video'
import videos from './yt'

const YouTube = () => {
  return (
    <Box>
      {videos.map((video) => (
        <Video key={video.title} video={video} />
      ))}
    </Box>
  )
}

export default YouTube
