import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import rows from './problems/react'
import { useNavigate } from 'react-router-dom'
import Rating from './Rating'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { Typography } from '@mui/material'

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
      <Typography sx={{ '&:hover': { textDecoration: 'underline' } }}>
        {params.row.title}
      </Typography>
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
    width: 110,
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
