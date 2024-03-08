import React, { useState, useEffect, useRef } from 'react'
import './runner.css'
import { Button } from '@mui/material'

function Game() {
  const canvasRef = useRef(null)
  const [obstacles, setObstacles] = useState([])
  const [dinosaurPosition, setDinosaurPosition] = useState({ x: 50, y: 300 })
  const [dinosaurVelocity, setDinosaurVelocity] = useState({ vx: 0, vy: 5 })
  const [isJumping, setIsJumping] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)

  // Function to restart the game
  const restartGame = () => {
    // Reset all state variables to their initial values
    setIsGameOver(false)
    setObstacles([])
    setDinosaurPosition({ x: 50, y: 300 })
    setDinosaurVelocity({ vx: 0, vy: 5 })
    setIsJumping(false)
  }

  // Function to handle dinosaur jump
  const jump = () => {
    if (!isJumping) {
      setIsJumping(true)
      setDinosaurVelocity({ ...dinosaurVelocity, vy: -10 })
    }
  }

  // Event listener for spacebar press
  const handleKeyDown = () => {
    jump()
  }

  // Effect to handle dinosaur movement and jump
  useEffect(() => {
    const gravity = 0.5

    const updateDinosaur = () => {
      if (dinosaurPosition.y < 300) {
        const newVelocity = {
          ...dinosaurVelocity,
          vy: dinosaurVelocity.vy + gravity,
        }
        setDinosaurVelocity(newVelocity)
      } else {
        setIsJumping(false)
      }

      const newPosition = {
        x: dinosaurPosition.x + dinosaurVelocity.vx,
        y: Math.min(dinosaurPosition.y + dinosaurVelocity.vy, 300),
      }
      // Check for collision with obstacles
      obstacles.forEach((obstacle) => {
        if (
          newPosition.x < obstacle.x + obstacle.width &&
          newPosition.x + 50 > obstacle.x &&
          newPosition.y < obstacle.y + obstacle.height &&
          newPosition.y + 50 > obstacle.y
        ) {
          endGame() // Collision detected, end the game
        }
      })

      setDinosaurPosition(newPosition)
    }

    const intervalId = setInterval(updateDinosaur, 16)

    return () => {
      clearInterval(intervalId)
    }
  }, [dinosaurPosition, dinosaurVelocity, isJumping])

  const endGame = () => {
    setIsGameOver(true)
  }

  // Effect to handle obstacles
  useEffect(() => {
    const frameId = setInterval(() => {
      setObstacles((prevObstacles) => {
        return prevObstacles.map((obstacle) => {
          return { ...obstacle, x: obstacle.x - obstacle.speed }
        })
      })
    }, 16)

    const obstacleInterval = setInterval(() => {
      const newObstacle = {
        x: 700,
        y: 300,
        width: 50,
        height: 50,
        speed: 5,
      }
      setObstacles((prevObstacles) => [...prevObstacles, newObstacle])
    }, 2000)

    return () => {
      clearInterval(frameId)
      clearInterval(obstacleInterval)
    }
  }, [])

  // Effect to draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw obstacles
    obstacles.forEach((obstacle) => {
      ctx.fillStyle = 'white'
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
    })

    // Draw dinosaur
    ctx.fillStyle = 'green'
    ctx.fillRect(dinosaurPosition.x, dinosaurPosition.y, 50, 50)
  }, [obstacles, dinosaurPosition])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 150px)',
      }}
    >
      {isGameOver && (
        <div className='overlay'>
          <div className='overlay-content'>
            <h2>Game Over</h2>
            <button onClick={restartGame}>Restart Game</button>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        style={{
          border: 'solid white 1px',
          backgroundColor: 'black',
        }}
      />
      <Button variant='contained' onClick={handleKeyDown}>
        Jump
      </Button>
    </div>
  )
}

export default Game
