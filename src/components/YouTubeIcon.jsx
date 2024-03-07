import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import YouTubeIcon from '@mui/icons-material/YouTube'

const YouTube = ({ workout }) => (
  <Tooltip title='Watch the video' placement='bottom'>
    <IconButton size='small'>
      <a
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        href={workout.youtubeLink}
        target='_blank'
        rel='noreferrer'
      >
        <YouTubeIcon color='error' fontSize='medium' />
      </a>
    </IconButton>
  </Tooltip>
)

export default YouTube
