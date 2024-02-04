// components
import { NavLink } from 'react-router-dom'
import decks from './trueOrFalse.json'
import { Box, Typography } from '@mui/material'
import { RootFrame} from '../../rootStyledComponents'
import {
  StyledTableContainer,
  StyledTable,
  StyledTableCell,
  StyledIconTableCell,
  StyledTableRow,
} from '../workouts/table/tableStyledComponents'
import TableBody from '@mui/material/TableBody'

const Games = () => {
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
        <NavLink to='/games' children='Back to games' end                       className={({ isActive, isPending }) =>
                        `nav-link ${isActive ? 'active' : isPending ? 'pending' : 'not-active'}`
                      }
                      style={{
                        ':hover': {
                          textDecoration: 'underline',
                          color: 'primary.main',
                          cursor: 'pointer !important',
                        },
                      }}/>
          <Box>
            <Typography variant='h5' color='grey.400'>
              Choose a deck
            </Typography>
            <Typography variant='subtitle1' color='grey.600'>
              Each deck contains 5 true or false questions.
            </Typography>
          </Box>
          <StyledTableContainer>
            <StyledTable size='small' stickyHeader>
              <TableBody>        
                  {decks.map((deck, index) => (
                <StyledTableRow>
                  <StyledTableCell>
                    <NavLink
                      variant='subtitle'
                      to={`/games/true-or-false/${deck.to}`}
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
                        {deck.title}
                      </Typography>
                    </NavLink>
                  </StyledTableCell>
                  <StyledTableCell> 
                      <span>{deck.language}</span>
                    </StyledTableCell>
                </StyledTableRow>
                  ))}
              </TableBody>
            </StyledTable>
          </StyledTableContainer>
        </Box>
      </RootFrame>
  )
}

export default Games
