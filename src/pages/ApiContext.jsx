/* eslint-disable react/prop-types */
import { createContext, useState } from 'react'

const ApiContext = createContext()

const ApiProvider = ({ children }) => {
  const [apiState, setApiState] = useState({
    running: false,
    method: '',
    call: '',
  })

  return (
    <ApiContext.Provider value={{ apiState, setApiState }}>
      {children}
    </ApiContext.Provider>
  )
}

export { ApiContext, ApiProvider }
