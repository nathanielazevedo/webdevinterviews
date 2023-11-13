/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
// import { useLocation } from 'react-router-dom'
import { Button, Fade, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useParams, useNavigate } from 'react-router-dom'
import rows from '../../workouts/index'
import Rating from '../Rating'
import Tooltip from '@mui/material/Tooltip'
import YouTubeIcon from '@mui/icons-material/YouTube'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import Checkbox from '@mui/material/Checkbox'

const EditorTopNav = () => {
  // const location = useLocation()
  const params = useParams()
  const workout = rows.find((row) => row.name === params.workoutName)
  const navigate = useNavigate()

  return (
    <Fade in={true} timeout={1000}>
      <Box
        sx={{
          display: 'flex',
          // height: '35px',
          alignItems: 'center',
          borderBottom: '0.5px solid #454950',
          transition: 'height 0.3s ease-in-out',
          // border: 'solid 1px green',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            // border: 'solid 1px blue',
            // justifyContent: 'space-between',
            // alignItems: 'flex-end',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              // gap: '50px',
              width: '100%',
              // border: 'solid 1px yellow',
              // justifyContent: 'space-between',
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
                marginRight: '20px',
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
                    {workout.checkList.map((item, index) => (
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
                <a
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  href={workout.link}
                  target='_blank'
                  rel='noreferrer'
                >
                  <YouTubeIcon sx={{ color: 'darkred' }} fontSize='small' />
                </a>
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
