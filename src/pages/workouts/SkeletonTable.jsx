import Skeleton from '@mui/material/Skeleton'
import { TableRow, TableCell } from '@mui/material'

export default function SkeletonTable() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
        <TableRow
          key={index}
          sx={{
            width: '100%',
            td: { border: '0' },
            height: '30px',
          }}
        >
          <TableCell>
            <Skeleton animation='wave' />
          </TableCell>
          <TableCell>
            <Skeleton animation='wave' />
          </TableCell>
          <TableCell>
            <Skeleton animation='wave' />
          </TableCell>
          <TableCell>
            <Skeleton animation='wave' />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}
