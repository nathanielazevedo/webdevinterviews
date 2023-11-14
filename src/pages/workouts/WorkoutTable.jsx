import rows from '../../workouts'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import Rating from '../../components/Rating'
import Tooltip from '@mui/material/Tooltip'
import TableRow from '@mui/material/TableRow'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import YouTubeIcon from '@mui/icons-material/YouTube'
import TableContainer from '@mui/material/TableContainer'
import Fade from '@mui/material/Fade'
import { Form } from 'react-router-dom'
import { TableHead } from '@mui/material'
import Link from '@mui/material/Link'
import { useLoaderData } from 'react-router-dom'

const WorkoutTable = () => {
  const navigate = useNavigate()
  // const location = useLocation()
  // const filter = location.pathname.split('/').pop()
  // const tableRows = filter == 'workouts' ? orderById(rows) : filterRows(filter)
  const rows = useLoaderData()

  return (
    <Fade in={true} timeout={1000}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          padding: '00px 00px',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
        >
          <TableContainer sx={{ width: '100%', padding: '5px 20px' }}>
            <Table
              size='medium'
              sx={{ '& .MuiTableCell-head': { lineHeight: 1, color: 'grey' } }}
              aria-label='a dense table'
            >
              <TableHead elevation={2}>
                <TableRow
                  sx={{
                    width: '100%',
                    th: { border: 0, color: 'grey.600' },
                    // background: index % 2 === 0 ? '#171717' : '#121212',
                  }}
                >
                  <TableCell>name</TableCell>
                  <TableCell align='left'>video link</TableCell>
                  <TableCell align='left'>difficulty</TableCell>
                </TableRow>
              </TableHead>
              {rows.length > 0 && (
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow
                      key={row.name}
                      sx={{
                        width: '100%',
                        td: { border: 0 },
                        background: index % 2 === 0 ? '#171717' : '#121212',
                      }}
                    >
                      <TableCell align='right' sx={{ width: '100px' }}>
                        {/* <Tooltip
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
                          placement='right-start'
                        > */}
                        <Box
                          sx={{
                            gap: '2px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            variant='subtitle'
                            sx={{
                              ':hover': {
                                textDecoration: 'underline',
                                color: 'primary.main',
                                cursor: 'pointer !important',
                              },
                            }}
                            onClick={() => {
                              navigate(`/workout/${row.name}/editor`)
                            }}
                          >
                            {row.name}
                          </Typography>
                        </Box>
                        {/* </Tooltip> */}
                      </TableCell>
                      <TableCell align='left' sx={{ width: '150px' }}>
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
                            },
                          }}
                        >
                          {row.link}
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
      </Box>
    </Fade>
  )
}

export default WorkoutTable
