/* eslint-disable react/prop-types */
const Item = ({ item, index }) => {
  return (
    <li className='item'>
      <small className='item-number'>{index + 1}.</small>
      {item.charAt(0).toUpperCase() + item.slice(1)}
    </li>
  )
}

export default Item
