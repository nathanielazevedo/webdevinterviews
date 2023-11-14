/* eslint-disable react/prop-types */
import Item from './Item'

const List = ({ items, handleToggle }) => {
  return (
    <div className='list flex'>
      {items.map((item) => (
        <Item key={item} item={item} handleToggle={() => handleToggle(item)} />
      ))}
    </div>
  )
}

export default List
