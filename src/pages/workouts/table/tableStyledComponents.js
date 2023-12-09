/* eslint-disable no-unused-vars */
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { TableRow } from '@mui/material'

const StyledTableRow = styled(TableRow)(({ _, index }) => ({
  width: '100%',
  background: index % 2 !== 0 ? '#1a1a1a' : '#121212',
  border: 0,
  '& td': {
    border: 1,
  },
}))

const StyledTableContainer = styled(TableContainer)({
  width: '100%',
})

const StyledTable = styled(Table)({
  '& .MuiTableCell-head': {
    lineHeight: '30px',
    color: 'grey',
    border: 0,
    fontSize: '14px',
  },
  '& .MuiTableCell-body': {
    lineHeight: '35px',
    color: 'grey',
    fontSize: '14px',
  },
})

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  boxSizing: 'border-box',
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.grey[400],
  },
}))

const StyledIconTableCell = styled(TableCell)(({ theme }) => ({
  boxSizing: 'border-box',
  width: '50px',
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.grey[400],
  },
}))

export {
  StyledTableContainer,
  StyledTable,
  StyledTableCell,
  StyledTableRow,
  StyledIconTableCell,
}