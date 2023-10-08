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
    width: 450,
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
        onRowClick={(row) => {
          navigate(`${row.row.name}`)
        }}
      />
    </Box>
  )
}
