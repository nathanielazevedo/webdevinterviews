import Rating from '../components/Rating'
import Box from '@mui/material/Box'
import rows from './problems'
import { Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { GridActionsCellItem } from '@mui/x-data-grid'
import Tooltip from '@mui/material/Tooltip'

const columns = [
  {
    field: 'youtube',
    headerName: 'YouTube',
    width: '100',
    type: 'actions',
    align: 'center',
    headerAlign: 'center',
    getActions: (params) => [
      <GridActionsCellItem
        key='1'
        icon={
          <Tooltip title='Watch the video' placement='top'>
            <a
              style={{
                display: 'flex',
              }}
              href={params.row.link}
              target='_blank'
              rel='noreferrer'
            >
              <YouTubeIcon sx={{ color: '#FF0000' }} fontSize='large' />
            </a>
          </Tooltip>
        }
        label='Delete'
      />,
    ],
  },
  {
    field: 'title',
    headerName: 'Title',
    width: 150,
    renderCell: (params) => (
      <Tooltip
        title={
          <>
            <Typography sx={{ '&:hover': { textDecoration: 'underline' } }}>
              {params.row.title}
            </Typography>
            <Typography sx={{ '&:hover': { textDecoration: 'underline' } }}>
              {params.row.description}
            </Typography>
          </>
        }
        placement='bottom'
      >
        <Typography sx={{ '&:hover': { textDecoration: 'underline' } }}>
          {params.row.title}
        </Typography>
      </Tooltip>
    ),
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 1,
  },
  {
    field: 'difficulty',
    headerName: 'Difficulty',
    headerAlign: 'center',
    width: 110,
    align: 'center',
    renderCell: (params) => <Rating rating={params.row.difficulty} />,
  },
]

export default function DataGridDemo() {
  const navigate = useNavigate()

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter
        disableColumnMenu
        onRowClick={(row) => {
          navigate(`/workouts/react/${row.row.name}`)
        }}
        sx={{
          '.MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
            backgroundColor: 'inherit',
          },
        }}
      />
    </Box>
  )
}
