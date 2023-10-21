import './styles.css'
import data from './data'
import { useState } from 'react'
import { formatData } from './utils'
import CheckedTree from './CheckedTree'

const Main = () => {
  const items = formatData(data)
  const [formData, setFormData] = useState({ checkedTree: [] })

  const handleSubmit = () => {
    console.log(formData)
  }

  return (
    <div className='container'>
      <h1>Mock Form</h1>
      <input placeholder='Mock Input' className='common' />
      <input placeholder='Mock Input' className='common' />
      <CheckedTree
        data={items}
        onChange={(checkedItems) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            checkedTree: checkedItems,
          }))
        }}
      />
      <button onClick={handleSubmit} className='common'>
        Submit
      </button>
    </div>
  )
}

export default Main
