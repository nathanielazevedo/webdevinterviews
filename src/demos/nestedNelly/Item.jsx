/* eslint-disable react/prop-types */
const Item = ({ item }) => {
  return (
    <div
      key={item.id}
      style={{
        backgroundColor: 'white',
        color: 'black',
        display: 'flex',
        justifyContent: 'flex-start',
        padding: '5px',
      }}
    >
      <input type='checkbox' />
      {item.name}
    </div>
  )
}

export default Item
