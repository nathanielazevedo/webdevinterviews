import { TableHead as MuiTableHead } from '@mui/material'
import {
  StyledTableCell,
  StyledIconTableCell,
  StyledTableRow,
} from './tableStyledComponents'

const TableHead = () => (
  <MuiTableHead>
    <StyledTableRow>
      <StyledTableCell align='left'>Name</StyledTableCell>
      <StyledIconTableCell align='center'>Info</StyledIconTableCell>
      <StyledIconTableCell align='left'>Video</StyledIconTableCell>
      <StyledIconTableCell align='center'>Tags</StyledIconTableCell>
      <StyledTableCell align='center'>Difficulty</StyledTableCell>
    </StyledTableRow>
  </MuiTableHead>
)

export default TableHead
