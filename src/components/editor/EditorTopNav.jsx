/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
// import { useLocation } from 'react-router-dom'
import { Fade, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom'
import Rating from '../Rating'
import Tooltip from '@mui/material/Tooltip'
import YouTubeIcon from '@mui/icons-material/YouTube'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import Checkbox from '@mui/material/Checkbox'
import { useLoaderData } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'

const EditorTopNav = ({ editDialogOpen, setEditDialogOpen }) => {
  const { workout } = useLoaderData()
  const navigate = useNavigate()

  return (
    <Fade in={true} timeout={1000}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '0.5px solid #454950',
          transition: 'height 0.3s ease-in-out',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <IconButton
              color='grey.900'
              sx={{
                borderRadius: '0',
                height: '35px',
                maxHeight: '35px',
                width: '60px',
                color: 'grey.500',
                borderRight: '0.5px solid #454950',
                marginRight: '13px',
              }}
              onClick={() => navigate('/workouts')}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant='caption' mr={'45px'}>
              <span
                style={{
                  color: 'grey',
                  paddingRight: '7px',
                }}
              >
                WORKOUT #{workout.id} -
              </span>
              {workout.title}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: '15px',
              }}
            >
              <Tooltip
                title={
                  <>
                    {workout.gif && (
                      <img
                        src={workout.gif}
                        alt={workout.name}
                        style={{ maxWidth: '200px' }}
                      />
                    )}
                  </>
                }
                placement='bottom-start'
              >
                <Typography
                  sx={{
                    cursor: 'default',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: 'grey.500',
                    ':hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  GIF
                </Typography>
              </Tooltip>
              <Tooltip
                title={
                  <>
                    {workout.checklist &&
                      workout.checklist.map((item, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Checkbox />
                          <Typography key={index} fontSize='12px'>
                            {item}
                          </Typography>
                        </Box>
                      ))}
                  </>
                }
                placement='bottom'
              >
                <FormatListNumberedIcon
                  sx={{ color: 'grey.500' }}
                  fontSize='small'
                />
              </Tooltip>
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
              <Tooltip title='Edit' placement='bottom'>
                <IconButton size='small'>
                  <EditIcon
                    sx={{ color: 'primary.main' }}
                    fontSize='small'
                    onClick={() => {
                      setEditDialogOpen(!editDialogOpen)
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
        <Box pr={'20px'}>
          <Rating rating={workout.difficulty} />
        </Box>
      </Box>
    </Fade>
  )
}

export default EditorTopNav
