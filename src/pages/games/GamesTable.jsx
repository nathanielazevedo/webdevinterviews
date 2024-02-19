/* eslint-disable react/prop-types */
import TableBody from '@mui/material/TableBody'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import useFetch from '../../hooks/useFetch'
import ErrorRow from '../workouts/components/ErrorRow'
import TextLink from '../../components/TextLink'
import { NavLink } from 'react-router-dom'
import NoWorkouts from '../workouts/components/NoWorkouts'

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
      <Box>
        <Typography variant='h5' color='grey.400'>
          Games
        </Typography>
        <Typography variant='subtitle1' color='grey.600'>
          Some cool games I've made that will test your knowledge.
        </Typography>
      </Box>
      <table size='small' stickyHeader>
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
