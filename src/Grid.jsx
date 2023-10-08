import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import rows from './problems/react'
import { useNavigate } from 'react-router-dom'
import Rating from './Rating'

const columns = [
  {
    field: 'title',
    headerName: 'Title',
    width: 150,
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
          },
        }}
      />
    </Box>
  )
}
