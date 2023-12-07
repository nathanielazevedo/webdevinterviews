import Skeleton from '@mui/material/Skeleton'
import { TableBody, Box, Fade } from '@mui/material'
import {
  StyledTableRow,
  StyledTableCell,
  StyledTableContainer,
  StyledIconTableCell,
  StyledTable,
} from './tableStyledComponents'
import TableHead from './TableHead'

const SkeletonTable = () => {
  const getRandomWidth = () => `${Math.floor(Math.random() * 10) + 20}%`
  return (
    <Box>
      <Fade in timeout={1000}>
        <Box>
          <StyledTableContainer>
            <StyledTable size='small'>
              <TableHead />
              <TableBody>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <StyledTableRow key={item} index={item}>
                    <StyledTableCell align='left'>
                      <Skeleton variant='text' width={getRandomWidth()} />
                    </StyledTableCell>
                    <StyledIconTableCell align='center'>
                      <Skeleton variant='text' width='100%' />
                    </StyledIconTableCell>
                    <StyledIconTableCell align='center'>
                      <Skeleton variant='text' width='100%' />
                    </StyledIconTableCell>
                    <StyledIconTableCell align='center'>
                      <Skeleton variant='text' width='100px' />
                    </StyledIconTableCell>
                    <StyledIconTableCell align='center'>
                      <Skeleton variant='text' width='60px' />
                    </StyledIconTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </StyledTable>
          </StyledTableContainer>
        </Box>
      </Fade>
    </Box>
  )
}

export default SkeletonTable
