import Cart from './Cart'
import { useState } from 'react'
import { cart1, cart2 } from './data.js'

const SwapOdds = () => {
  const [cartA, setCartA] = useState(cart1)
  const [cartB, setCartB] = useState(cart2)

  const swapOdds = () => {
    const newCartA = [...cartA]
    const newCartB = [...cartB]
    for (let i = 0; i < newCartA.length; i += 2) {
      const temp = newCartA[i]
      newCartA[i] = newCartB[i]
      newCartB[i] = temp
    }
    setCartA(newCartA)
    setCartB(newCartB)
  }

  return (
    <div className='page flex'>
      <div className='container flex'>
        <Cart cartNumber={1} data={cartA} />
        <button onClick={swapOdds} className='swap-button'>
          Swap Odds
        </button>
        <Cart cartNumber={2} data={cartB} />
      </div>
    </div>
  )
}

export default SwapOdds
