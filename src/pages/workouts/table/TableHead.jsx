/* eslint-disable react/prop-types */
import { TableHead as MuiTableHead } from '@mui/material'
import {
  StyledTableCell,
  StyledIconTableCell,
  StyledTableRow,
} from './tableStyledComponents'

const TableHead = ({ isYours }) => (
  <MuiTableHead>
    <StyledTableRow>
      <StyledIconTableCell align='center' />
      <StyledTableCell align='left'>NAME</StyledTableCell>
      <StyledIconTableCell align='center'>TEMPLATE</StyledIconTableCell>
      <StyledTableCell align='center'>DEPENDENCIES</StyledTableCell>
      <StyledTableCell align='center'>DIFFICULTY</StyledTableCell>
      <StyledTableCell align='center'>
        {isYours ? 'PUBLIC STATUS' : 'CREATOR'}
      </StyledTableCell>
      <StyledTableCell align='center'>DATE CREATED</StyledTableCell>
      <StyledIconTableCell align='left'>VIDEO</StyledIconTableCell>
    </StyledTableRow>
  </MuiTableHead>
)

export default TableHead
