/* eslint-disable react/prop-types */
// Tab.js

const Tab = ({ tab, onClick, active }) => {
  return (
    <div
      className='tab'
      onClick={onClick}
      style={{
        borderBottom: active ? '2px solid blue' : '1px solid black',
      }}
    >
      <b
        style={{
          color: active ? 'blue' : 'black',
        }}
      >
        {tab}
      </b>
    </div>
  )
}

export default Tab
