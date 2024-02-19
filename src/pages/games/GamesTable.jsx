import { Typography } from '@mui/material'
import TextLink from '../../components/TextLink'
import Header from '../../components/Header'

const games = [
  {
    title: 'true or false',
    to: 'true-or-false',
  },
  {
    title: 'Will it throw?',
    to: 'will-it-throw',
  },
]

const Games = ({ tab }) => {
  return (
    <div className='fit-wrapper'>
      <Header
        title='Games'
        subtext="Some cool games I've made that will test your knowledge."
      />
      <table>
        <thead>
          <tr>
            <th align='left'>Name</th>
            <th align='right'>Language</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, key) => (
            <tr key={game.name}>
              <td align='left' style={{ paddingLeft: '15px' }}>
                <TextLink to={game.to} text={game.title} />
              </td>
              <td align='right' style={{ paddingRight: '15px' }}>
                <Typography color='grey.500'>JavaScript</Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Games
