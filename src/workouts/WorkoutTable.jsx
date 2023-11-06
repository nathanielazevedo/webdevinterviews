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
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

export default function DenseTable() {
  const navigate = useNavigate()
  const location = useLocation()
  const filter = location.pathname.split('/').pop()
  console.log(filter)
  const filteredRows =
    filter == 'workouts' ? rows : rows.filter((row) => row.type === filter)
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
        <Typography variant='h5' mb={'15px'}>
          Workouts
        </Typography>
        {filteredRows.length === 0 ? (
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
                {filteredRows.map((row, index) => (
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
                    <TableCell align='center'>
                      <Typography variant='subtitle'>{row.id}.</Typography>
                    </TableCell>
                    <TableCell align='left' sx={{ cursor: 'pointer' }}>
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
                        placement='right'
                      >
                        <PhotoSizeSelectActualIcon
                          sx={{
                            color: 'grey.700',
                          }}
                        />
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
                            sx={{ color: 'grey.700' }}
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
