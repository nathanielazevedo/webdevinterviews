import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import Video from './Video'

const YouTube = () => {
  const [videoIds, setVideoIds] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        'https://www.googleapis.com/youtube/v3/search?key=AIzaSyDOcpfOx5tAJplJTvYGfZRYxo3C4M9mcOM&channelId=UC-4Ij6StciJgYzbxLyxHMPw&part=snippet,id&order=date&maxResults=20'
      )
      const d = await data.json()
      setVideoIds(d.items.map((e) => e.id.videoId))
    }
    fetchData()
  }, [])
  console.log(videoIds)
  return (
    <Box>
      {videoIds.map((videoId) => (
        <Video key={videoId} videoId={videoId} />
      ))}
    </Box>
  )
}

export default YouTube
