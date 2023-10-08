import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import rows from './problems/react'
import { useNavigate } from 'react-router-dom'

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
          // disable cell selection style
          '.MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          // pointer cursor on ALL rows
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
          },
        }}
      />
    </Box>
  )
}
