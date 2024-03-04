import { Typography, Divider } from '@mui/material'
import Item from './Item'
import { AuthContext } from '../../../contexts/AuthContext'
import { useContext } from 'react'

const List = ({ headerText, items, basePath }) => {
  const { displayName } = useContext(AuthContext)
  const isRandom = basePath.includes('random')

  items.forEach((item, index) => {
    if (displayName) {
      item.public = true
    } else if (index <= 4) {
      item.public = true
    }
  })

  if (isRandom) {
    return (
      <>
        <Item
          item={{
            title: 'Random Questions',
            public: displayName,
            id: 'r',
            description: 'From our question pool .',
          }}
          basePath={basePath}
          className='no-line'
        />
        <Divider sx={{ marginTop: '20px' }}>OR</Divider>
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Typography sx={{ color: 'grey.500' }}>
            Random questions deck by deck.
          </Typography>
          <Typography variant='caption' sx={{ color: 'grey.500' }} noWrap>
            {items.length} decks
          </Typography>
        </div>

        <div style={{ margin: '20px 0' }}>
          {items.map((item, index) => {
            return <Item key={index} item={item} basePath={basePath} />
          })}
        </div>
      </>
    )
  } else {
    return (
      <>
        <Typography sx={{ color: 'grey.500' }}>{headerText}</Typography>
        <div style={{ margin: '20px 0' }}>
          {items.map((item, index) => {
            return <Item key={index} item={item} basePath={basePath} />
          })}
        </div>
      </>
    )
  }
}

export default List
