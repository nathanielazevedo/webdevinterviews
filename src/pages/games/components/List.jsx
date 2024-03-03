import { Typography, Divider } from '@mui/material'
import Item from './Item'
import { AuthContext } from '../../../contexts/AuthContext'
import { useContext } from 'react'

const List = ({ headerText, items, basePath }) => {
  const { displayName } = useContext(AuthContext)
  const isRandom = items[0].id == 'random'

  items.forEach((item, index) => {
    if (displayName) {
      item.public = true
    } else if (index <= 4) {
      item.public = true
    }
  })

  if (isRandom) {
    const randomItem = items[0]
    return (
      <>
        <Typography sx={{ color: 'grey.500' }}>{headerText}</Typography>
        <Item item={randomItem} basePath={basePath} />
        <Divider>OR</Divider>
        <Typography sx={{ color: 'grey.500' }} mt={'20px'}>
          Get random questions in a semi-organized fashion.
        </Typography>
        <div style={{ margin: '20px 0' }}>
          {items.slice(1).map((item, index) => {
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
