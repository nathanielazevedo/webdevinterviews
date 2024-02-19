import { NavLink } from 'react-router-dom'
import decks from './trueOrFalse.json'
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
