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
          border: 'solid grey 1px',
          padding: '5px',
          borderRadius: '5px',
          backgroundColor: 'lightgreen',
        }}
      ></div>
      <div
        style={{
          border: 'solid grey 1px',
          padding: '5px',
          borderRadius: '5px',
          backgroundColor: rating > 1 ? 'yellow' : 'transparent',
        }}
      ></div>
      <div
        style={{
          border: 'solid grey 1px',
          padding: '5px',
          borderRadius: '5px',
          backgroundColor: rating > 2 ? 'red' : 'transparent',
        }}
      ></div>
    </div>
  )
}

export default Rating
