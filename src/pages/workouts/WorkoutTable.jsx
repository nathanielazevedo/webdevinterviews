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

const WorkoutTable = () => {
  const navigate = useNavigate()
  const { rows } = useLoaderData()

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
                // borderBottom:
                //   '0.3px solid var(--color-solid-resize-bar-handle)',
              },
              '& .MuiTableCell-body': {
                lineHeight: '25px',
                color: 'grey',
                border: 0,
                fontSize: '14px',
                width: '140px',
                minWidth: '140px',
                maxWidth: '140px',
                // borderBottom:
                //   '0.3px solid var(--color-solid-resize-bar-handle)',
              },
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  width: '100px',
                }}
              >
                <TableCell
                  align='left'
                  sx={{
                    paddingLeft: '70px',
                    width: '100px',
                    minWidth: '100px',
                    maxWidth: '100px',
                    // outline: 'solid white 1px !important',
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
            {rows.length > 0 && (
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={row.name}
                    sx={{
                      width: '100%',
                      background: index % 2 === 0 ? '#1a1a1a' : '#121212',
                      td: { border: '0' },
                    }}
                  >
                    <TableCell align='left' sx={{ paddingLeft: '45px' }}>
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
                              {row.gif && (
                                <img
                                  src={row.gif}
                                  alt={row.name}
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
                            navigate(`/workout/${row.name}`)
                          }}
                        >
                          {row.name}
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
                        href={row.link}
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
                          {row.link}
                        </Typography>
                      </Link>
                    </TableCell>
                    <TableCell align='left' sx={{ width: '150px' }}>
                      <Rating rating={row.difficulty} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        {rows.length == 0 && (
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
      </Box>
    </Fade>
  )
}

export default WorkoutTable
