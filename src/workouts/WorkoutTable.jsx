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

export default function DenseTable() {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: '50px',
      }}
    >
      <TableContainer
        sx={{
          maxWidth: 550,
        }}
      >
        <Table sx={{ maxWidth: 550 }} size='medium' aria-label='a dense table'>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={row.name}
                sx={{
                  td: { border: 0 },
                  background: index % 2 === 0 ? '#1a1a1a' : '#121212',
                }}
              >
                <TableCell align='center'>
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
                    <PhotoSizeSelectActualIcon
                      sx={{
                        color: 'grey.500',
                      }}
                    />
                  </Tooltip>
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
                <TableCell align='center'>
                  <Rating rating={row.difficulty} />
                </TableCell>
                <TableCell
                  align='center'
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Tooltip title='Watch the video' placement='bottom'>
                    <a
                      style={{ display: 'flex' }}
                      href={row.link}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <YouTubeIcon
                        sx={{ color: '#FF0000' }}
                        fontSize='medium'
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
  )
}
