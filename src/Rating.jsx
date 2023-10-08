// eslint-disable-next-line react/prop-types
const Rating = ({ rating }) => {
  console.log(rating)
  return (
    <div
      style={{
        display: 'flex',
        gap: '5px',
      }}
    >
      <div
        style={{
          border: 'solid transparent 1px',
          padding: '5px',
          borderRadius: '5px',
          backgroundColor: 'lightgreen',
        }}
      ></div>
      <div
        style={{
          border: 'solid transparent 1px',
          padding: '5px',
          borderRadius: '5px',
          backgroundColor: 'yellow',
        }}
      ></div>
      <div
        style={{
          border: 'solid transparent 1px',
          padding: '5px',
          borderRadius: '5px',
          backgroundColor: 'red',
        }}
      ></div>
    </div>
  )
}

export default Rating
