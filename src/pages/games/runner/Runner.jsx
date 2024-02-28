// Game.js
import React, { useState, useEffect, useRef } from 'react'
import GameCanvas from './GameCanvas'
import Dinosaur from './Dinosaur'
import Obstacle from './Obstacle'

function Game() {
  const [dinosaurPos, setDinosaurPos] = useState({ x: 50, y: 300 })
  const [obstacles, setObstacles] = useState([])
  const canvasRef = useRef(null)

  useEffect(() => {
    // Update obstacle positions every frame
    const frameId = setInterval(() => {
      setObstacles((prevObstacles) => {
        return prevObstacles.map((obstacle) => {
          // Update the x position based on speed
          return { ...obstacle, x: obstacle.x - obstacle.speed }
        })
      })
    }, 16) // Run at ~60 frames per second

    // Clear the interval on component unmount
    return () => clearInterval(frameId)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const obstacleInterval = setInterval(() => {
      // Generate new obstacles
      const newObstacle = {
        x: 700,
        y: 300,
        width: 20,
        height: 20,
        speed: 10,
      }
      setObstacles((prevObstacles) => [...prevObstacles, newObstacle])
    }, 2000)

    // Clear interval on component unmount
    return () => clearInterval(obstacleInterval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef?.current
    const ctx = canvas?.getContext('2d')

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // // Draw dinosaur
    // ctx.fillStyle = 'green'
    // ctx.fillRect(dinosaurPos.x, dinosaurPos.y, 50, 50)

    // Draw obstacles
    obstacles.forEach((obstacle) => {
      ctx.fillStyle = 'black'
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
    })
  }, [obstacles])

  // Handle user input (jumping)
  // useEffect(() => {
  //   function handleKeyDown(event) {
  //     if (event.code === 'Space') {
  //       // Jump logic
  //       setDinosaurPos((prevPos) => ({ ...prevPos, y: prevPos.y - 50 }))
  //     }
  //   }
  //   window.addEventListener('keydown', handleKeyDown)
  //   return () => window.removeEventListener('keydown', handleKeyDown)
  // }, [])

  return (
    <div>
      <h1>Google Chrome Dinosaur Game</h1>
      <GameCanvas canvasRef={canvasRef}>
        <Dinosaur
          canvasRef={canvasRef}
          x={dinosaurPos.x}
          y={dinosaurPos.y}
          setPosition={setDinosaurPos}
          position={dinosaurPos}
        />
        {obstacles.map((obstacle, index) => (
          <Obstacle
            key={index}
            x={obstacle.x}
            y={obstacle.y}
            width={obstacle.width}
            height={obstacle.height}
          />
        ))}
      </GameCanvas>
    </div>
  )
}

export default Game
