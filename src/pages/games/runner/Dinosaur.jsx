import React, { useState, useEffect } from 'react'

function Dinosaur({ x, y, canvasRef, position, setPosition }) {
  const [velocity, setVelocity] = useState({ vx: 0, vy: 5 })
  const [isJumping, setIsJumping] = useState(false)

  useEffect(() => {
    const gravity = 0.5 // Adjust gravity strength as needed

    const canvas = canvasRef?.current
    const ctx = canvas?.getContext('2d')
    // Draw dinosaur
    ctx.fillStyle = 'green'
    ctx.fillRect(position.x, position.y, 50, 50)

    const jump = () => {
      if (!isJumping) {
        setIsJumping(true)
        setPosition((prevPos) => ({ ...prevPos, y: prevPos.y - 50 }))
        setVelocity({ ...velocity, vy: -10 }) // Adjust jump velocity as needed
      }
    }

    const handleKeyDown = (event) => {
      console.log('jump')
      if (event.code === 'Space') {
        jump()
      }
    }

    const updateDinosaur = () => {
      // Apply gravity when the dinosaur is in the air
      if (position.y < 300) {
        const newVelocity = { ...velocity, vy: velocity.vy + gravity }
        setVelocity(newVelocity)
      } else {
        setIsJumping(false) // Reset jumping flag when dinosaur lands
      }

      // Update position based on velocity
      const newPosition = {
        x: position.x + velocity.vx,
        y: Math.min(position.y + velocity.vy, 300), // Prevent dinosaur from falling through the ground
      }
      setPosition(newPosition)
    }

    window.addEventListener('keydown', handleKeyDown)
    const intervalId = setInterval(updateDinosaur, 1000 / 60) // Update approximately 60 times per second

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearInterval(intervalId)
    }
  }, [position, velocity, isJumping])

  return (
    <div style={{ position: 'absolute', left: position.x, top: position.y }}>
      {/* Dinosaur graphics */}
      <span role='img' aria-label='dinosaur'>
        🦕
      </span>
    </div>
  )
}

export default Dinosaur
