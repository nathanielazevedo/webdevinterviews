// Obstacle.js
import React from 'react'

function Obstacle({ x, y, width, height }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        backgroundColor: 'black',
      }}
    >
      O{/* Obstacle graphics */}
    </div>
  )
}

export default Obstacle
