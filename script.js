const scoreDisplay = document.querySelector('.score')
const grid = document.querySelector('.grid')
const arrowsDisplay = document.querySelector(".arrows")

class Block{
  constructor(xAxis, yAxis){
    this.bottomLeft = [xAxis, yAxis]
    this.bottomRight = [xAxis + 100, yAxis]
    this.topLeft = [xAxis, yAxis + 20]
    this.topRight = [xAxis + 100, yAxis + 20]
  }
}

const userStart = [230, 10]
const currentPosition = userStart
const boardWidth = 560
const boardHeight = 300
const blockWidth = 100
const blockHeight = 20
const ballDiameter = 20
const ballposition = [270, 30]
const currentBallPosition = ballposition
let xDirection = Math.random()*0.1;
let yDirection = 2
let timerId
let score = 0
let isArrowleftDown = false
let isArrowRightDown = false

const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210)
]

function addBlock (){
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.style.left = `${blocks[i].bottomLeft[0]}px`
    block.style.bottom = `${blocks[i].bottomLeft[1]}px`
    grid.appendChild(block)
  }
}
addBlock()


const user = document.createElement( 'div' )
user.classList.add( 'user' )
drawUser()
grid.appendChild( user )

function drawUser(){
  user.style.left = `${currentPosition[0]}px`
  user.style.bottom = `${currentPosition[1]}px`
}

function drawBall() {
  ball.style.left = `${ballposition[0]}px`
  ball.style.bottom = `${ballposition[1]}px`
}

function moveUser(e){
  switch(e.key){
    case "ArrowLeft":
      isArrowleftDown = true;
      isArrowRightDown = false;
      break;
    case "ArrowRight":
      isArrowRightDown = true;
      isArrowleftDown = false;
      break;
  }
}

function stopUser(e){
  switch(e.key){
    case "ArrowLeft":
      isArrowleftDown = false;
      break;
    case "ArrowRight":
      isArrowRightDown = false;
      break;
  }
}

function moveUserArrowkeyLeft() {
  if (currentPosition[0] > 0) {
    currentPosition[0] -= 10;
    drawUser();
  }
}

function moveUserArrowkeyRight() {
  if (currentPosition[0] < boardWidth - blockWidth) {
    currentPosition[0] += 10;
    drawUser();
  }
}

document.addEventListener("keydown", moveUser)
document.addEventListener('keyup', stopUser)

const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)

function moveBall() {
  currentBallPosition[0] += xDirection
  currentBallPosition[1] += yDirection
  drawBall()
  checkForCollision()

  if(isArrowleftDown) {
    if (currentPosition[0] > 0){
      currentPosition[0] -= 3
      drawUser()
    }
  }

  if(isArrowRightDown){
    if (currentPosition[0] < boardWidth - blockWidth) {
      currentPosition[0] += 3
      drawUser()
    }
  }
}

timerId = setInterval(moveBall, 10)

function checkForCollision() {
  for (let i = 0; i < blocks.length; i++) {
    if ((currentBallPosition[0] + ballDiameter > blocks[i].bottomLeft[0] && currentBallPosition[0] < blocks[i].bottomRight[0]) &&
    ((currentBallPosition[1] + ballDiameter > blocks[i].bottomRight[1] && currentBallPosition[1] < blocks[i].topLeft[1]))) {
      const allBlocks = Array.from(document.querySelectorAll('.block'))
      allBlocks[i].classList.remove('block')
      blocks.splice(i, 1)
      changeDirection()
      score++
      scoreDisplay.innerHTML = score
      break;
    }
  }

  
  
  if (currentBallPosition[0] >= (boardWidth - ballDiameter) || currentBallPosition[0] <= 0) {
    xDirection = -xDirection; // Reverse x direction on hitting left or right walls
  }

  if (currentBallPosition[1] >= (boardHeight - ballDiameter) || currentBallPosition[1] <= 0) {
    yDirection = -yDirection; // Reverse y direction on hitting top or bottom walls
  }


  if (
    (currentBallPosition[0] > currentPosition[0] && currentBallPosition[0] < currentPosition[0] + blockWidth) &&
    (currentBallPosition[1] > currentPosition[1] && currentBallPosition[1] < currentPosition[1] + blockHeight)
  ) {
  // Calculate paddle and ball centers
  let paddleCenter = currentPosition[0] + blockWidth / 2;
  let ballCenter = currentBallPosition[0] + ballDiameter / 2;

  // Calculate deltaX, the difference between ball and paddle centers
  let deltaX = ballCenter - paddleCenter;

  // Adjust xDirection based on deltaX to change ball trajectory
  xDirection = deltaX * 0.01; // Adjust this factor for paddle influence on ball direction
  yDirection = -yDirection; // Reverse y direction to make the ball bounce upwards
  }

  
  if (currentBallPosition[1] <= 0){
    clearInterval(timerId)
    scoreDisplay.innerHTML = 'Game Over! Try Again.'
    document.removeEventListener('keydown', moveUser)
    rightArrowDisplay.removeEventListener( "click", moveUserArrowkeyRight)
    leftArrowDisplay.removeEventListener( "click", moveUserArrowkeyLeft)
  }

  if (blocks.length === 0) {
    clearInterval(timerId)
    scoreDisplay.innerHTML = 'Congrats! You win.'
    document.removeEventListener('keydown', moveUser)
    rightArrowDisplay.removeEventListener( "click", moveUserArrowkeyRight)
    leftArrowDisplay.removeEventListener( "click", moveUserArrowkeyLeft)

  }
}

function changeDirection() {
  if (xDirection > 0 && yDirection > 0) {
    yDirection = -yDirection
    return
  }
  if (xDirection > 0 && yDirection < 0) {
    xDirection = -xDirection
    return
  }
  if (xDirection < 0 && yDirection < 0) {
    xDirection = -xDirection
    return
  }
  if (xDirection < 0 && yDirection > 0) {
    yDirection = -yDirection
    return
  }
}


const rightArrowDisplay = document.createElement("div")
rightArrowDisplay.classList.add("rightArrowDisplay")
rightArrowDisplay.addEventListener( "click", moveUserArrowkeyRight)
arrowsDisplay.appendChild(rightArrowDisplay)

const leftArrowDisplay = document.createElement("div")
leftArrowDisplay.classList.add("leftArrowDisplay")
leftArrowDisplay.addEventListener( "click", moveUserArrowkeyLeft)
arrowsDisplay.appendChild(leftArrowDisplay)
