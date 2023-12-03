import Skeleton from '@mui/material/Skeleton'
import { StyledTableRow, StyledTableCell } from './styles/tableStyles'

export default function SkeletonTable() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
        <StyledTableRow key={index}>
          <StyledTableCell>
            <Skeleton />
          </StyledTableCell>
          <StyledTableCell>
            <Skeleton />
          </StyledTableCell>
          <StyledTableCell>
            <Skeleton />
          </StyledTableCell>
          <StyledTableCell>
            <Skeleton />
          </StyledTableCell>
          <StyledTableCell>
            <Skeleton />
          </StyledTableCell>
        </StyledTableRow>
      ))}
    </>
  )
}
