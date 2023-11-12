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

const orderById = (rows) => {
  const rowsOrderedById = rows.sort((a, b) => a.id - b.id)
  return rowsOrderedById
}

const filterRows = (filter) => {
  const filteredRows = rows.filter((row) => row.type === filter)
  const filteredAndOrderedRows = orderById(filteredRows)
  return filteredAndOrderedRows
}

const WorkoutTable = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const filter = location.pathname.split('/').pop()
  const tableRows = filter == 'workouts' ? orderById(rows) : filterRows(filter)

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        padding: '30px 30px',
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
        <Typography mb='25px' color='primary'>
          WORKOUTS
        </Typography>
        <TableContainer sx={{ width: '100%' }}>
          <Table
            size='medium'
            sx={{ width: '100%' }}
            aria-label='a dense table'
          >
            <TableBody>
              {tableRows.map((row, index) => (
                <TableRow
                  key={row.name}
                  sx={{
                    width: '100%',
                    td: { border: 0 },
                    background: index % 2 === 0 ? '#171717' : '#121212',
                  }}
                >
                  <TableCell
                    align='left'
                    sx={{ cursor: 'pointer', width: '300px' }}
                  >
                    <Typography
                      variant='subtitle'
                      sx={{
                        fontWeight: 'bold',
                        color: 'grey.600',
                        paddingRight: '10px',
                        marginLeft: '40px',
                      }}
                    >
                      {row.id}.
                    </Typography>
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
                        const local = JSON.parse(localStorage.getItem(row.name))
                        if (local && local.activeTab) {
                          navigate(`/workouts/${row.name}/${local.activeTab}`)
                        } else {
                          navigate(`/workouts/${row.name}/details`)
                        }
                      }}
                    >
                      {row.title}
                    </Typography>
                  </TableCell>
                  <TableCell align='right' sx={{ width: '150px' }}>
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
                      placement='left'
                    >
                      <Box
                        sx={{
                          gap: '2px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          sx={{
                            cursor: 'default',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            color: 'grey.700',
                            ':hover': {
                              color: 'primary.main',
                            },
                          }}
                        >
                          GIF
                        </Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell align='center' sx={{ width: '150px' }}>
                    <Rating rating={row.difficulty} />
                  </TableCell>
                  <TableCell align='center' sx={{ width: '150px' }}>
                    <Tooltip title='Watch the video' placement='bottom'>
                      <a
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        href={row.link}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <YouTubeIcon
                          sx={{ color: 'darkred' }}
                          fontSize='large'
                        />
                      </a>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

export default WorkoutTable
