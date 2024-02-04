/* eslint-disable react/prop-types */
import TableBody from '@mui/material/TableBody'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import SkeletonTable from '../workouts/table/WorkoutsTable'
import useFetch from '../../hooks/useFetch'
import ErrorRow from '../workouts/components/ErrorRow'
import TextLink from '../workouts/components/TextLink'
import { NavLink } from 'react-router-dom'
import {
  StyledTableContainer,
  StyledTable,
  StyledTableCell,
  StyledIconTableCell,
  StyledTableRow,
} from '../workouts/table/tableStyledComponents'
import NoWorkouts from '../workouts/components/NoWorkouts'
import { RootFrame } from '../../rootStyledComponents'

const Games = ({ tab }) => {
  return (
    <RootFrame>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '25px',
            margin: '30px 30px',
          }}
        >
        <Box>
          <Typography variant='h5' color='grey.400'>
            Games
          </Typography>
          <Typography variant='subtitle1' color='grey.600'>
            Some cool games I've made that will test your knowledge.
          </Typography>
        </Box>
        <StyledTableContainer>
          <StyledTable size='small' stickyHeader>
            <TableBody>        
              <StyledTableRow>
                <StyledTableCell align='left'>
                    <NavLink
                      variant='subtitle'
                      to={`/games/true-or-false`}
                      className={({ isActive, isPending }) =>
                        `nav-link ${isActive ? 'active' : isPending ? 'pending' : 'not-active'}`
                      }
                      style={{
                        ':hover': {
                          textDecoration: 'underline',
                          color: 'primary.main',
                          cursor: 'pointer !important',
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: '14px',
                          textTransform: 'capitalize',
                          ':hover': {
                            textDecoration: 'underline',
                            color: 'primary.main',
                            cursor: 'pointer !important',
                          },
                        }}
                      >
                        true or false
                      </Typography>
                    </NavLink>
                </StyledTableCell>
                <StyledIconTableCell align='center'>
                  JavaScript
                </StyledIconTableCell>
              </StyledTableRow>
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      </Box>
    </RootFrame>
  )
}

export default Games