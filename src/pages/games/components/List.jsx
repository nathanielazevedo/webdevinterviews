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
        <Typography sx={{ color: 'grey.500' }}>{headerText}</Typography>
        <Item
          item={{ title: 'Random Questions', public: displayName, id: 'r' }}
          basePath={basePath}
        />
        <Divider>OR</Divider>
        <Typography sx={{ color: 'grey.500' }} mt={'20px'}>
          Get random questions in a semi-organized fashion.
        </Typography>
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
