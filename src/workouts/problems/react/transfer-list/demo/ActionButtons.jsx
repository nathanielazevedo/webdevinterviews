/* eslint-disable react/prop-types */
const ActionButtons = ({ moveRight, moveLeft }) => {
  return (
    <div className='buttons flex'>
      <button onClick={moveRight}>&gt;</button>
      <button onClick={moveLeft}>&lt;</button>
    </div>
  )
}

export default ActionButtons
