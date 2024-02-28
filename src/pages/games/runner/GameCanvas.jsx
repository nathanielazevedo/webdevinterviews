// GameCanvas.js
import React, { useRef, useEffect } from 'react'

function GameCanvas({ canvasRef, children }) {
  // const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef?.current
    const ctx = canvas?.getContext('2d')
    // Additional setup and drawing operations
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      style={{ border: 'solid 1px white', backgroundColor: 'white' }}
    >
      {children}
    </canvas>
  )
}

export default GameCanvas
