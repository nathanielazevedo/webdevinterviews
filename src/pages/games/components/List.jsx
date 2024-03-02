import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Item from './Item'
import { AuthContext } from '../../../contexts/AuthContext'
import { useContext } from 'react'

const List = ({ headerText, items, basePath }) => {
  const navigate = useNavigate()
  const { displayName } = useContext(AuthContext)

  items.forEach((item) => {
    if (displayName) {
      item.public = true
    }
  })

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

export default List
