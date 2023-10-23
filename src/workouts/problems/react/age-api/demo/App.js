/* eslint-disable no-prototype-builtins */
import './styles.css'
import { useState } from 'react'

const App = () => {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [previousSearches, setPreviousSearches] = useState({})

  const handleSubmit = async () => {
    try {
      if (previousSearches.hasOwnProperty(text)) {
        setResult(previousSearches[text])
      } else {
        const response = await fetch(`https://api.agify.io/?name=${text}`)
        if (!response.ok) {
          throw new Error(response.status)
        }
        const result = await response.json()
        setResult(result.age)
        setPreviousSearches({ ...previousSearches, [text]: result.age })
      }
    } catch (e) {
      console.log(e)
    } finally {
      setText('')
    }
  }

  return (
    <div className='page flex'>
      <div className='card flex'>
        <div className='form flex'>
          <input
            value={text}
            placeholder='Enter a Name'
            onChange={(evt) => setText(evt.target.value)}
          />
          <button disabled={text === ''} onClick={handleSubmit}>
            SUBMIT
          </button>
        </div>
        <h1>{result ?? '-'}</h1>
      </div>
    </div>
  )
}

export default App
