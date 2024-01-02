/* eslint-disable react/prop-types */
import Skeleton from '@mui/material/Skeleton'
import { TableBody, Box, Fade } from '@mui/material'
import {
  StyledTableRow,
  StyledNameTableCell,
  StyledTableContainer,
  StyledIconTableCell,
  StyledTable,
} from './tableStyledComponents'
import TableHead from './TableHead'

const SkeletonTable = ({ isYours }) => {
  const getRandomWidth = () => `${Math.floor(Math.random() * 10) + 40}%`
  return (
    <Box>
      <Fade in timeout={1000}>
        <Box>
          <StyledTableContainer>
            <StyledTable size='small'>
              <TableHead isYours={isYours} />
              <TableBody>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <StyledTableRow key={item} index={item}>
                    <StyledNameTableCell align='left' id='name'>
                      <Skeleton variant='text' width={getRandomWidth()} />
                    </StyledNameTableCell>
                    <StyledIconTableCell align='center' id='template'>
                      <Skeleton variant='text' width='100%' />
                    </StyledIconTableCell>
                    <StyledIconTableCell align='center' id='difficulty'>
                      <Skeleton variant='text' width='100%' />
                    </StyledIconTableCell>
                    <StyledIconTableCell align='center' id='creator'>
                      <Skeleton variant='text' width='100%' />
                    </StyledIconTableCell>
                    <StyledIconTableCell align='center' id='date'>
                      <Skeleton variant='text' width='100$' />
                    </StyledIconTableCell>
                    <StyledIconTableCell align='center' id='video'>
                      <Skeleton variant='text' width='100%' />
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
