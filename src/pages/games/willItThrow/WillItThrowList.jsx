// components
import { NavLink } from 'react-router-dom'
import decks from './willItThrow.json'
import { Box, Typography } from '@mui/material'
import TextLink from '../../../components/TextLink'
import Header from '../../../components/Header'

const Games = () => {
  return (
    <div className='fit-wrapper'>
      <TextLink to='/games' text='Back to games' />
      <Header
        title='Choose a deck'
        subtext='Each deck contains 5 true or false questions.'
      />
      <div>
        <table>
          <tbody>
            {decks.map((deck, index) => (
              <tr key={index}>
                <td style={{ paddingLeft: '15px' }}>
                  <TextLink
                    to={`/games/will-it-throw/${deck.to}`}
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
