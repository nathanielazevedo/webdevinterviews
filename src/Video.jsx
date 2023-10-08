/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'

const Video = ({ videoId }) => {
  const [video, setVideo] = useState()
  useEffect(() => {
    const fetchVideo = async () => {
      const data = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=AIzaSyDOcpfOx5tAJplJTvYGfZRYxo3C4M9mcOM`
      )
      const video = await data.json()
      setVideo(video)
    }
    if (!video) fetchVideo()
  }, [])
  console.log(video)
  return <div></div>
}

export default Video
