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
    field: 'id',
    headerName: '#',
    width: 100,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => (
      <Typography
        sx={{ '&:hover': { textDecoration: 'underline' } }}
        variant='subtitle'
      >
        {params.row.id}
      </Typography>
    ),
  },
  {
    field: 'title',
    headerName: 'Title',
    width: 150,
    flex: 1,
    renderCell: (params) => (
      <Tooltip
        title={
          <>
            {params.row.gif && (
              <img
                src={params.row.gif}
                alt={params.row.name}
                style={{ maxWidth: '100%' }}
              />
            )}
          </>
        }
        placement='bottom'
      >
        <Typography variant='subtitle'>{params.row.title}</Typography>
      </Tooltip>
    ),
  },
  {
    field: 'difficulty',
    headerName: 'Difficulty',
    headerAlign: 'center',
    width: 110,
    align: 'center',
    renderCell: (params) => <Rating rating={params.row.difficulty} />,
  },
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
          <Tooltip title='Watch the video' placement='bottom'>
            <a
              style={{ display: 'flex' }}
              href={params.row.link}
              target='_blank'
              rel='noreferrer'
            >
              <YouTubeIcon sx={{ color: '#FF0000' }} fontSize='medium' />
            </a>
          </Tooltip>
        }
        label='Delete'
      />,
    ],
  },
]

export default function DataGridDemo() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        width: '100%',
        padding: '20px 20vw',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter
        rowHeight={38}
        disableColumnMenu
        disableRowSelectionOnClick
        sx={{
          '&, [class^=MuiDataGrid]': { border: 'none' },
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
            backgroundColor: 'inherit',
          },
          '.MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '.MuiDataGrid-columnHeaderTitle': {
            color: 'grey',
          },
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        onRowClick={(row) => {
          navigate(`/workouts/react/${row.row.name}`)
        }}
        // sx={{
        // '.MuiDataGrid-cell:focus': {
        //   outline: 'none',
        // },
        // '& .MuiDataGrid-row:hover': {
        //   cursor: 'pointer',
        // },
        // }}
      />
    </Box>
  )
}
