import React, { useState, useEffect, useRef } from 'react'
import fishImage from './Walk.png'
import water from './background2.png'
import './runner.css'

function Game() {
  const canvasRef = useRef(null)
  const [fishPosition, setFishPosition] = useState({ x: 100, y: 200 })
  const [fishFrameIndex, setFishFrameIndex] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isMovingUp, setIsMovingUp] = useState(false)
  const [isMovingDown, setIsMovingDown] = useState(false)
  const canvasHeight = 300
  const moveSpeed = 20
  const frameWidth = 47
  const fishSpriteSheet = fishImage
  const fishFrames = 4

  // draws the fish
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const fishImage = new Image()
    fishImage.src = fishSpriteSheet

    const drawFish = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(
        fishImage,
        fishFrameIndex * frameWidth,
        0,
        frameWidth,
        frameWidth,
        fishPosition.x,
        fishPosition.y,
        frameWidth,
        frameWidth
      )
    }

    const updateFishFrame = () => {
      setFishFrameIndex((prevIndex) => (prevIndex + 1) % fishFrames)
    }

    const animationInterval = setInterval(() => {
      updateFishFrame()
      drawFish()
    }, 100)

    return () => clearInterval(animationInterval)
  }, [fishFrameIndex, fishPosition])

  // Function to move the fish up
  const moveFishUp = () => {
    setFishPosition((prevPosition) => ({
      ...prevPosition,
      y: Math.max(prevPosition.y - moveSpeed, 0), // Ensure fish doesn't move out of the canvas
    }))
  }

  // Function to move the fish down
  const moveFishDown = () => {
    setFishPosition((prevPosition) => ({
      ...prevPosition,
      y: Math.min(prevPosition.y + moveSpeed, canvasHeight - 50), // Ensure fish doesn't move out of the canvas
    }))
  }

  // Event listeners for mouse down, up, and move events
  useEffect(() => {
    const handleMouseDown = (event) => {
      if (event.clientY < canvasHeight / 2) {
        setIsMovingUp(true)
      } else {
        setIsMovingDown(true)
      }
    }

    const handleMouseUp = () => {
      setIsMovingUp(false)
      setIsMovingDown(false)
    }

    const handleMouseMove = () => {
      if (isMovingUp) {
        setFishPosition((prevPosition) => ({
          ...prevPosition,
          y: Math.max(prevPosition.y - moveSpeed, 0),
        }))
      } else if (isMovingDown) {
        setFishPosition((prevPosition) => ({
          ...prevPosition,
          y: Math.min(prevPosition.y + moveSpeed, canvasHeight - 50),
        }))
      }
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isMovingUp, isMovingDown])

  useEffect(() => {
    let intervalId

    const moveFish = () => {
      if (isMovingUp) {
        moveFishUp()
      } else if (isMovingDown) {
        moveFishDown()
      }
    }

    if (isMovingUp || isMovingDown) {
      intervalId = setInterval(moveFish, 150)
    }

    return () => clearInterval(intervalId)
  }, [isMovingUp, isMovingDown])

  useEffect(() => {
    const handleTouchStart = (event) => {
      const touchY = event.touches[0].clientY
      if (touchY < canvasHeight / 2) {
        setIsMovingUp(true)
      } else {
        setIsMovingDown(true)
      }
    }

    const handleTouchEnd = () => {
      setIsMovingUp(false)
      setIsMovingDown(false)
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [canvasHeight])

  // Effect to move the fish continuously while the mouse button is pressed

  return (
    <div
      className='background'
      style={{
        background: `url(${water})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        width: '100vw',
        maxWidth: '100vw',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 100,
        backgroundColor: 'green',
        height: '100vh',
      }}
    >
      {isGameOver && (
        <div className='overlay'>
          <div className='overlay-content'>
            <h2>Game Over</h2>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={500}
        height={canvasHeight}
        style={{ border: 'solid white 1px' }}
      />
    </div>
  )
}

export default Game
