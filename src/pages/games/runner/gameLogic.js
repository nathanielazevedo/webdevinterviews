import background from './background.png'
import fishImages from './Walk.png'
import torpedoImage from './Torpedo.png'
import getQuestions from '../components/swimmerDecks'

export function initializeGame(answer) {
  const canvas = document.getElementById('gameCanvas')
  const questionSpot = document.getElementById('question')
  let currentQuestion = 0
  const ctx = canvas.getContext('2d')
  const questions = getQuestions().questions
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height
  let backgroundX = 0
  const backgroundImage = new Image()
  backgroundImage.src = background

  backgroundImage.onload = () => {
    gameLoop()
  }

  const torpImage = new Image()
  torpImage.src = torpedoImage

  const torpedoes = []

  const scrollSpeed = 1
  function updateBackgroundPosition() {
    backgroundX -= scrollSpeed

    if (backgroundX <= -canvasWidth) {
      backgroundX = 0
    }
  }

  const fishImage = new Image()
  fishImage.src = fishImages

  const moveSpeed = 3
  const frameWidth = 47
  const fishFrames = 4

  let fishPosition = { x: 100, y: 200 }
  let fishFrameIndex = 0
  let isGameOver = false
  let isMovingUp = false
  let isMovingDown = false
  let count = 0

  function drawBackground() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.drawImage(backgroundImage, backgroundX, 0, canvasWidth, canvasHeight)
    ctx.drawImage(
      backgroundImage,
      backgroundX + canvasWidth,
      0,
      canvasWidth,
      canvasHeight
    )
  }

  function drawFish() {
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

  function updateFishFrame() {
    count += 1
    if (count > 10) {
      count = 0
      fishFrameIndex = (fishFrameIndex + 1) % fishFrames
    }
  }

  function moveFishUp() {
    fishPosition.y = Math.max(fishPosition.y - moveSpeed, 0)
  }

  function moveFishDown() {
    fishPosition.y = Math.min(fishPosition.y + moveSpeed, canvasHeight - 50)
  }

  function createTorpedo() {
    if (
      torpedoes.length === 0 ||
      !torpedoes.some((torpedo) => torpedo.status)
    ) {
      // const middleY = canvasHeight / 2
      const minDistance = 100 // Minimum distance from the edge
      const maxDistance = canvasHeight - minDistance // Maximum distance from the edge
      const torpedoY = Math.random() * (maxDistance - minDistance) + minDistance

      const torpedo = {
        x: canvasWidth,
        y: torpedoY,
        width: 50,
        height: 20,
        speed: 2, // Adjust speed as needed
        status: true, // true means active, false means inactive
        pastFish: false,
      }
      torpedoes.push(torpedo)
      currentQuestion++
      questionSpot.innerText = questions[currentQuestion].question
    }
  }

  function checkFishPositionRelativeToTorpedo() {
    torpedoes.forEach((torpedo) => {
      if (
        fishPosition.x < torpedo.x + torpedo.width &&
        fishPosition.x + frameWidth > torpedo.x &&
        !torpedo.pastFish
      ) {
        // Check if the fish is above or below the torpedo
        torpedo.pastFish = true
        const evaluated = eval(questions[currentQuestion].question)
        if (fishPosition.y < torpedo.y) {
          if (evaluated) {
            answer('correct')
          } else {
            isGameOver = true
            answer('incorrect')
          }
        } else {
          if (evaluated) {
            isGameOver = true
            answer('incorrect')
          } else {
            answer('correct')
          }
        }
      }
    })
  }

  function drawTorpedoes() {
    torpedoes.forEach((torpedo) => {
      if (torpedo.status) {
        // Save the current state of the canvas
        ctx.save()

        // Translate the origin to the center of the torpedo
        ctx.translate(
          torpedo.x + torpedo.width / 2,
          torpedo.y + torpedo.height / 2
        )

        // Rotate the canvas by 90 degrees (in radians)
        ctx.rotate(-Math.PI / 2)

        // Draw the torpedo with the rotated context
        ctx.drawImage(
          torpImage,
          -torpedo.height / 2,
          -torpedo.width / 2,
          torpedo.height,
          torpedo.width
        )

        // Restore the canvas state to prevent affecting other drawings
        ctx.restore()
      }
    })
  }

  function moveTorpedoes() {
    torpedoes.forEach((torpedo) => {
      if (torpedo.status) {
        torpedo.x -= torpedo.speed
        if (torpedo.x < 0) {
          torpedo.status = false
        }
      }
    })
  }

  function checkCollision() {
    torpedoes.forEach((torpedo) => {
      if (
        fishPosition.x < torpedo.x + torpedo.width &&
        fishPosition.x + frameWidth > torpedo.x &&
        fishPosition.y < torpedo.y + torpedo.height &&
        fishPosition.y + frameWidth > torpedo.y
      ) {
        isGameOver = true
      }
    })
  }

  function gameLoop() {
    if (isGameOver) {
      document.getElementById('startOverButton').style.display = 'block'
      return
    } else {
      document.getElementById('startOverButton').style.display = 'none'
    }

    updateBackgroundPosition()
    drawBackground()

    updateFishFrame()
    drawFish()
    checkFishPositionRelativeToTorpedo()

    if (isMovingUp) {
      moveFishUp()
    } else if (isMovingDown) {
      moveFishDown()
    }

    createTorpedo()
    moveTorpedoes()
    drawTorpedoes()
    checkCollision()

    requestAnimationFrame(gameLoop)
  }

  // Define event handler functions
  function handleMouseDown(event) {
    handleInput(event.clientX, event.clientY)
  }

  function handleMouseUp() {
    isMovingUp = false
    isMovingDown = false
  }

  function handleTouchStart(event) {
    event.preventDefault()
    handleInput(event.touches[0].clientX, event.touches[0].clientY)
  }

  function handleTouchEnd() {
    isMovingUp = false
    isMovingDown = false
  }

  // Function to handle input (common for both mouse and touch events)
  function handleInput(x, y) {
    if (y < canvasHeight / 2) {
      isMovingUp = true
    } else {
      isMovingDown = true
    }
  }

  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('touchstart', handleTouchStart)

  canvas.addEventListener('mouseup', handleMouseUp)
  canvas.addEventListener('touchend', handleTouchEnd)

  document.getElementById('startOverButton').addEventListener('click', () => {
    isGameOver = false
    fishPosition = { x: 100, y: 200 }
    torpedoes.length = 0
    gameLoop()
  })
}
