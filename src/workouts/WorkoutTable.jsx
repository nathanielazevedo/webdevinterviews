import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import rows from './problems'
import YouTubeIcon from '@mui/icons-material/YouTube'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Rating from '../components/Rating'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

export default function DenseTable() {
  const navigate = useNavigate()
  const location = useLocation()
  const filter = location.pathname.split('/').pop()
  const filteredRows =
    filter == 'workouts' ? rows : rows.filter((row) => row.type === filter)

  const rowsOrderedById = filteredRows.sort((a, b) => a.id - b.id)

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        padding: ' 20px 40px',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <Typography
          mb={'25px'}
          sx={{
            color: 'var(--lightBlue)',
            letterSpacing: '2px',
            borderBottom: 'solid 1px var(--lightBlue)',
          }}
        >
          WORKOUTS
        </Typography>
        {rowsOrderedById.length === 0 ? (
          <Typography color='grey.500'>
            Sorry, No {filter} questions yet.
          </Typography>
        ) : (
          <TableContainer sx={{ width: '100%' }}>
            <Table
              size='medium'
              aria-label='a dense table'
              sx={{ width: '100%' }}
            >
              <TableBody>
                {rowsOrderedById.map((row, index) => (
                  <TableRow
                    key={row.name}
                    sx={{
                      td: { border: 0 },
                      background: index % 2 === 0 ? '#1a1a1a' : '#121212',
                      borderRadius: '20px',
                      // border: 'solid 0.5px var(--color-solid-resize-bar)',
                      height: '70px',
                      width: '100%',
                    }}
                  >
                    {/* <TableCell align='center'>
                      <Typography
                        variant='subtitle'
                        sx={{
                          fontWeight: 'bold',
                          color: '#19e4ff',
                        }}
                      >
                        {row.id}.
                      </Typography>
                    </TableCell> */}
                    <TableCell
                      align='left'
                      sx={{ cursor: 'pointer', paddingLeft: '75px' }}
                    >
                      <Typography
                        variant='subtitle'
                        sx={{
                          fontWeight: 'bold',
                          color: 'grey.600',
                          paddingRight: '10px',
                        }}
                      >
                        {row.id}.
                      </Typography>
                      <Typography
                        variant='subtitle'
                        sx={{
                          ':hover': {
                            textDecoration: 'underline',
                            color: 'info.light',
                            cursor: 'pointer !important',
                          },
                        }}
                        onClick={() => navigate(`/workouts/react/${row.name}`)}
                      >
                        {row.title}
                      </Typography>
                    </TableCell>
                    <TableCell align='left'>
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
                            display: 'flex',
                            gap: '2px',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            sx={{
                              cursor: 'pointer',
                              color: 'grey.700',
                            }}
                          >
                            GIF
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align='center'>
                      <Rating rating={row.difficulty} />
                    </TableCell>
                    <TableCell align='center' sx={{}}>
                      <Tooltip title='Watch the video' placement='bottom'>
                        <a
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
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
        )}
      </Box>
    </Box>
  )
}
