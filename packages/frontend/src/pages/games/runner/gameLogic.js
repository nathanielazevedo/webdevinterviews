import background from './background.svg'
import fishImages from './turtleWalk.png'
import torpedoImage from './Walk.png'
import getQuestions from '../components/swimmerDecks'
import attack from './Attack.png'
import turtleHurt from './Hurt.png'

export function initializeGame(returnScore = () => {}) {
  document.getElementById('intro-screen').style.display = 'none'
  const questionSpot = document.getElementById('question')
  const scoreSpot = document.getElementById('scoreSpot')
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

  const moveSpeed = 5
  const frameWidth = 48
  const fishFrames = 4

  let fishPosition = { x: 50, y: canvasHeight / 2 - 25 }
  let fishFrameIndex = 0
  let isGameOver = false
  let isMovingUp = false
  let count = 0
  const torpedoes = []
  let scrollSpeed = 1

  const backgroundImage = new Image()
  backgroundImage.src = background

  const torpImage = new Image()
  torpImage.src = torpedoImage

  const fishImage = new Image()
  fishImage.src = fishImages

  const attackImage = new Image()
  attackImage.src = attack

  const hurtImage = new Image()
  hurtImage.src = turtleHurt

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
      isGameOver ? hurtImage : fishImage,
      isGameOver ? 1 * frameWidth : fishFrameIndex * frameWidth,
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
    if (count > 7) {
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
        torpedo.pastFish = true
        const evaluated = eval(questions[currentQuestion].question)
        if (fishPosition.y < torpedo.y) {
          if (evaluated) {
            score++
          } else {
            isGameOver = true
            returnScore(score)
          }
        } else {
          if (evaluated) {
            isGameOver = true
            returnScore(score)
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

        ctx.scale(-1, 1)

        ctx.drawImage(
          isGameOver ? attackImage : torpImage,
          fishFrameIndex * frameWidth,
          0,
          frameWidth,
          frameWidth,
          -torpedo.height / 2,
          -torpedo.width / 2,
          frameWidth,
          frameWidth
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

  function gameLoop() {
    if (isGameOver) {
      torpedoes[torpedoes.length - 1].y = fishPosition.y + 15
      torpedoes[torpedoes.length - 1].x = fishPosition.x + 50
      scrollSpeed = 0
      updateBackgroundPosition()
      drawBackground()
      drawTorpedoes()
      updateFishFrame()
      drawFish()
      requestAnimationFrame(gameLoop)
      gameOverButton.style.display = 'flex'
      scoreSpot.innerText = 'Your Score: ' + score
      questionSpot.style.display = 'none'

      return
    } else {
      gameOverButton.style.display = 'none'
      questionSpot.style.display = 'block'
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

    requestAnimationFrame(gameLoop)
  }

  // Add event listeners
  function handleMouseDown() {
    isMovingUp = true
  }

  function handleMouseUp() {
    isMovingUp = false
  }

  function handleTouchStart(event) {
    event.preventDefault()
    isMovingUp = true
  }

  function handleTouchEnd() {
    isMovingUp = false
  }

  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('touchstart', handleTouchStart)

  canvas.addEventListener('mouseup', handleMouseUp)
  canvas.addEventListener('touchend', handleTouchEnd)

  document.getElementById('playAgain').addEventListener('click', () => {
    isGameOver = false
    score = 0
    scrollSpeed = 1
    fishPosition = { x: 50, y: canvasHeight / 2 }
    torpedoes.length = 0
  })
}
