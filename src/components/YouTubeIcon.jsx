/* eslint-disable react/prop-types */
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import YouTubeIcon from '@mui/icons-material/YouTube'

const YouTube = ({ workout }) => {
  return (
    <Tooltip title='Watch the video' placement='bottom'>
      <IconButton size='small'>
        <a
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          href={workout.youtube_link}
          target='_blank'
          rel='noreferrer'
        >
          <YouTubeIcon sx={{ color: 'darkred' }} fontSize='small' />
        </a>
      </IconButton>
    </Tooltip>
  )
}

export default YouTube
