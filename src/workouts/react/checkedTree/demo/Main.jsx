import { useState } from 'react'
import data from './data'
import CheckedTree from './Gpt'
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
        border: 'solid white 1px',
        backgroundColor: 'white',
        width: '500px',
        padding: '20px',
      }}
    >
      <h2>Mock Form</h2>
      <CheckedTree
        data={items}
        onChange={(checkedItems) => {
          setFormData((prevFormData) => {
            const newFormData = { ...prevFormData, checkedTree: checkedItems }
            return newFormData
          })
        }}
      />
      <button onClick={handleSubmit} style={{ width: '200px' }}>
        Submit
      </button>
    </div>
  )
}

export default Main
