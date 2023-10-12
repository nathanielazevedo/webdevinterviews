import { useState } from 'react'
import data from './data'
import CheckedTree from './CheckedTree'
import { formatData } from './utils'

const Main = () => {
  const [items] = useState(formatData(data))
  const [formData, setFormData] = useState({ checkedTree: [] })

  const handleSubmit = () => {
    console.log(formData)
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        margin: '30px',
        width: '500px',
        padding: '30px',
        color: 'black',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <h1 style={{ alignSelf: 'flex-start' }}>Mock Form</h1>
      <input
        type='text'
        placeholder='Mock Input 1'
        style={{ width: '100%', padding: '10px' }}
      />
      <input
        type='text'
        placeholder='Mock Input 2'
        style={{ width: '100%', padding: '10px' }}
      />
      <input
        type='text'
        placeholder='Mock Input 3'
        style={{ width: '100%', padding: '10px' }}
      />

      <CheckedTree
        data={items}
        onChange={(checkedItems) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            checkedTree: checkedItems,
          }))
        }}
      />
      <button onClick={handleSubmit} style={{ width: '100%', padding: '10px' }}>
        Submit
      </button>
    </div>
  )
}

export default Main
