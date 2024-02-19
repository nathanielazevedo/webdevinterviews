import { NavLink } from 'react-router-dom'
import decks from './trueOrFalse.json'
import { Box, Typography } from '@mui/material'
import TextLink from '../../../components/TextLink'

const Games = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
        padding: '30px 30px',
      }}
    >
      <TextLink to='/games' text='Back to games' />
      <Box>
        <Typography variant='h5' color='grey.400'>
          Choose a deck
        </Typography>
        <Typography variant='subtitle1' color='grey.600'>
          Each deck contains 5 true or false questions.
        </Typography>
      </Box>
      <div style={{ height: 'calc(100vh - 215px)', overflowY: 'scroll' }}>
        <table>
          <tbody>
            {decks.map((deck, index) => (
              <tr key={index}>
                <td align='left' style={{ paddingLeft: '15px' }}>
                  <TextLink
                    to={`/games/true-or-false/${deck.to}`}
                    text={deck.title}
                  />
                </td>
                <td align='right' style={{ paddingRight: '15px' }}>
                  <Typography color='grey.500'>{deck.language}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Games
