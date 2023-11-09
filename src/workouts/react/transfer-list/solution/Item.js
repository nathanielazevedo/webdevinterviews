/* eslint-disable react/prop-types */
const Item = ({ item, handleToggle }) => {
  return (
    <label>
      <input type='checkbox' onChange={handleToggle} />
      {item}
    </label>
  )
}

export default Item
