import background from './background.svg'
import fishImages from './Walk.png'
import torpedoImage from './torpedo.png'
import getQuestions from '../components/swimmerDecks'

export function initializeGame() {
  document.getElementById('intro-screen').style.display = 'none'
  const questionSpot = document.getElementById('question')
  const gameOverButton = document.getElementById('startOverButton')
  const canvas = document.getElementById('gameCanvas')
  const ctx = canvas.getContext('2d')

  let currentQuestion = 0
  const questions = getQuestions().questions
  let score = 0

  const aspectRatio = 16 / 9
  const canvasWidth = Math.min(window.innerWidth, 800)
  const canvasHeight = canvasWidth / aspectRatio
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  let backgroundX = 0

  const moveSpeed = 4
  const frameWidth = 47
  const fishFrames = 4

  let fishPosition = { x: 50, y: canvasHeight / 2 - 25 }
  let fishFrameIndex = 0
  let isGameOver = false
  let isMovingUp = false
  let count = 0
  const torpedoes = []
  const scrollSpeed = 1

  const backgroundImage = new Image()
  backgroundImage.src = background

  const torpImage = new Image()
  torpImage.src = torpedoImage

  const fishImage = new Image()
  fishImage.src = fishImages

  backgroundImage.onload = () => {
    gameLoop()
  }

  function updateBackgroundPosition() {
    backgroundX -= scrollSpeed

    if (backgroundX <= -canvasWidth) {
      backgroundX = 0
    }
  }

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
    if (count > 5) {
      count = 0
      fishFrameIndex = (fishFrameIndex + 1) % fishFrames
    }
  }

  function moveFishUp() {
    fishPosition.y = Math.max(fishPosition.y - moveSpeed, 0)
  }

  function moveFishDown() {
    fishPosition.y = Math.min(fishPosition.y + 1, canvasHeight - 50)
  }

  function createTorpedo() {
    if (
      torpedoes.length === 0 ||
      !torpedoes.some((torpedo) => torpedo.status)
    ) {
      const torpedo = {
        x: canvasWidth,
        y: canvasHeight / 2 - 10,
        width: 50,
        height: 20,
        speed: 2,
        status: true,
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
            score++
          } else {
            isGameOver = true
          }
        } else {
          if (evaluated) {
            isGameOver = true
          } else {
            score++
          }
        }
      }
    })
  }

  function drawTorpedoes() {
    torpedoes.forEach((torpedo) => {
      if (torpedo.status) {
        ctx.save()

        ctx.translate(
          torpedo.x + torpedo.width / 2,
          torpedo.y + torpedo.height / 2
        )

        ctx.rotate(-Math.PI / 2)

        ctx.drawImage(
          torpImage,
          -torpedo.height / 2,
          -torpedo.width / 2,
          torpedo.height,
          torpedo.width
        )

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
      gameOverButton.style.display = 'block'
      questionSpot.innerText = 'Your Score: ' + score
      return
    } else {
      gameOverButton.style.display = 'none'
    }

    updateBackgroundPosition()
    drawBackground()

    updateFishFrame()
    drawFish()
    checkFishPositionRelativeToTorpedo()

    if (isMovingUp) {
      moveFishUp()
    } else {
      moveFishDown()
    }

    createTorpedo()
    moveTorpedoes()
    drawTorpedoes()
    checkCollision()

    requestAnimationFrame(gameLoop)
  }

  // Define event handler functions
  function handleMouseDown() {
    handleInput()
  }

  function handleMouseUp() {
    isMovingUp = false
  }

  function handleTouchStart(event) {
    event.preventDefault()
    handleInput()
  }

  function handleTouchEnd() {
    isMovingUp = false
  }

  // Function to handle input (common for both mouse and touch events)
  function handleInput() {
    isMovingUp = true
  }

  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('touchstart', handleTouchStart)

  canvas.addEventListener('mouseup', handleMouseUp)
  canvas.addEventListener('touchend', handleTouchEnd)

  document.getElementById('startOverButton').addEventListener('click', () => {
    isGameOver = false
    score = 0
    fishPosition = { x: 50, y: canvasHeight / 2 }
    torpedoes.length = 0
    gameLoop()
  })
}
