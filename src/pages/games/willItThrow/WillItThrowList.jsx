// components
import { NavLink } from 'react-router-dom'
import decks from './willItThrow.json'
import { Box, Typography } from '@mui/material'

const Games = () => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '25px',
          margin: '30px 30px',
        }}
      >
        <NavLink
          to='/games'
          children='Back to games'
          end
          className={({ isActive, isPending }) =>
            `nav-link ${
              isActive ? 'active' : isPending ? 'pending' : 'not-active'
            }`
          }
          style={{
            ':hover': {
              textDecoration: 'underline',
              color: 'primary.main',
              cursor: 'pointer !important',
            },
          }}
        />
        <Box>
          <Typography variant='h5' color='grey.400'>
            Choose a deck
          </Typography>
          <Typography variant='subtitle1' color='grey.600'>
            Each deck contains 5 true or false questions.
          </Typography>
        </Box>
        <div>
          <table>
            <tbody>
              {decks.map((deck, index) => (
                <tr key={index}>
                  <td style={{ paddingLeft: '15px' }}>
                    <NavLink
                      variant='subtitle'
                      to={`/games/will-it-throw/${deck.to}`}
                      className={({ isActive, isPending }) =>
                        `nav-link ${
                          isActive
                            ? 'active'
                            : isPending
                            ? 'pending'
                            : 'not-active'
                        }`
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
                  </td>
                  <td align='right' style={{ paddingRight: '15px' }}>
                    <Typography color='grey.500'>{deck.language}</Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Box>
    </>
  )
}

export default Games
