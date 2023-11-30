import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import Rating from '../../components/Rating'
import TableRow from '@mui/material/TableRow'
import { useNavigate } from 'react-router-dom'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import PermMediaIcon from '@mui/icons-material/PermMedia'
import Fade from '@mui/material/Fade'
import { TableHead } from '@mui/material'
import Link from '@mui/material/Link'
import { useLoaderData } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip'
import { useContext } from 'react'
import { AuthContext } from '../AuthContext'
import Lock from '@mui/icons-material/Lock'
import { useState } from 'react'
import AuthDialog from './dialogs/AuthDialog'

const WorkoutTables = () => {
  const navigate = useNavigate()
  const { workouts } = useLoaderData()
  const { user } = useContext(AuthContext)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)

  const shouldShowLock = (user, access_level) => {
    if (access_level === 'free') {
      return false
    }

    if (user === null) {
      return true
    }

    // Add any other conditions here

    return false
  }

  return (
    <Fade in={true} timeout={1000}>
      <Box>
        <TableContainer sx={{ width: '100%', padding: '10px 20px' }}>
          <Table
            size='small'
            sx={{
              '& .MuiTableCell-head': {
                lineHeight: '25px',
                color: 'grey',
                border: 0,
                fontSize: '14px',
              },
              '& .MuiTableCell-body': {
                lineHeight: '25px',
                color: 'grey',
                border: 0,
                fontSize: '14px',
                // width: '120px',
                // minWidth: '120px',
                // maxWidth: '120px',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  align='center'
                  sx={{
                    width: '50px',
                    minWidth: '50px',
                    maxWidth: '50px',
                  }}
                ></TableCell>
                <TableCell
                  align='left'
                  sx={{
                    paddingLeft: '23px',
                    width: '100px',
                    minWidth: '100px',
                    maxWidth: '100px',
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  align='left'
                  sx={{
                    width: '200px',
                    minWidth: '200px',
                    maxWidth: '200px',
                  }}
                >
                  Video Link
                </TableCell>
                <TableCell
                  align='left'
                  sx={{
                    width: '200px',
                    minWidth: '200px',
                    maxWidth: '200px',
                  }}
                >
                  Difficulty
                </TableCell>
              </TableRow>
            </TableHead>
            {workouts.length > 0 && (
              <TableBody>
                {workouts.map((workout, index) => (
                  <TableRow
                    key={workout.name}
                    sx={{
                      width: '100%',
                      background: index % 2 === 0 ? '#1a1a1a' : '#121212',
                      td: { border: '0' },
                    }}
                  >
                    <TableCell
                      sx={{
                        width: '20px',
                        minWidth: '20px',
                        maxWidth: '20px',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '10px',
                        }}
                      >
                        <Tooltip
                          title='This workout is only available to premium members.'
                          placement='left-start'
                        >
                          {shouldShowLock(user, workout.access_level) && (
                            <Lock
                              size='small'
                              sx={{
                                color: 'var(--red)',
                                fontSize: '20px',
                              }}
                            />
                          )}
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell align='left' sx={{ paddingLeft: '0px' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '9px',
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
                          placement='left-start'
                        >
                          <PermMediaIcon
                            sx={{
                              color: 'grey.600',
                              fontSize: '15px',
                            }}
                          />
                        </Tooltip>
                        <Typography
                          variant='subtitle'
                          sx={{
                            color: 'grey.300',
                            ':hover': {
                              textDecoration: 'underline',
                              color: 'primary.main',
                              cursor: 'pointer !important',
                            },
                          }}
                          onClick={() => {
                            if (shouldShowLock(user, workout.access_level)) {
                              setAuthDialogOpen(true)
                            } else {
                              navigate(`/workouts/${workout.id}`)
                            }
                          }}
                        >
                          {workout.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      align='left'
                      sx={{
                        width: '200px',
                        minWidth: '200px',
                        maxWidth: '200px',
                      }}
                    >
                      <Link
                        href={workout.youtube_link}
                        target='_blank'
                        rel='noreferrer'
                        sx={{
                          color: 'grey.500',
                          textDecorationColor: 'grey',
                          ':hover': {
                            textDecoration: 'underline',
                            color: 'primary.main',
                            cursor: 'pointer !important',
                            whiteSpace: 'nowrap',
                          },
                        }}
                      >
                        <Typography noWrap fontSize='12px'>
                          {workout.youtube_link}
                        </Typography>
                      </Link>
                    </TableCell>
                    <TableCell align='left' sx={{ width: '150px' }}>
                      <Rating rating={workout.difficulty} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        {workouts.length == 0 && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              color: 'grey.500',
            }}
          >
            No workouts found.
          </Box>
        )}
        <AuthDialog
          open={authDialogOpen}
          setOpen={setAuthDialogOpen}
          message='Sign in to view this workout'
        />
      </Box>
    </Fade>
  )
}

export default WorkoutTables
