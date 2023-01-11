const header = document.querySelector("#header");
const canvas = document.querySelector("#table");
const startButton = document.querySelector("#startButton")
const resetButton = document.querySelector("#resetButton")
const inputX = document.querySelector("#inputX")
const inputY = document.querySelector("#inputY") 
let mouse_position = null

canvas.addEventListener("mousemove", function(event) {
  //console.log(event.offsetX, event.offsetY, event.buttons)
  mouse_position = (event.buttons == 1) ? event :  null
})

let X = 10
const ball_radius = 30
const canvas_width = canvas.width
const canvas_height = canvas.height
const speed_factor = 3
let Y = 40  // max connection length  
const connect_width = 5

function Ball(x, y, x_speed, y_speed, connections) {
  return { x: x, y: y, x_speed: x_speed, y_speed: y_speed, connections: connections}
}

let playing = false

let balls = []  // Ball[]

X = parseInt(inputX.value)
Y = parseInt(inputY.value)
setRandomScane()

let startTime = null
let framesCounter = 0
let framesPerSek = 0

showStatistics()
requestAnimationFrame(animate)

function setRandomScane() {
  balls = []
  for (let i = 0; i < X; i++) {
    let { x, y, x_speed, y_speed, connections } = randomBall(); // connected balls (indexes)
    balls.push( Ball(x, y, x_speed, y_speed, connections));
  }
  calculateConnections();
}

function randomBall() {
  let x = ball_radius + Math.random() * (canvas_width - 2 * ball_radius)
  let y = ball_radius + Math.random() * (canvas_height - 2 * ball_radius)
  let x_speed = speed_factor * (Math.random() - 0.5)
  let y_speed = speed_factor * (Math.random() - 0.5)
  let connections = []; // connected balls (indexes)
  return Ball(x, y, x_speed, y_speed, connections)
}

function calculateConnections() {
  // how to avoid repeated connections? j = i + 1 !
  for(let i = 0; i < balls.length - 1; i++) {
    let currentBallConnections = []
    for(let j = i + 1; j < balls.length; j++) {
      let d = distance(balls[i], balls[j])
      if (d <= (Y + 2 * ball_radius)) {
        currentBallConnections.push(j)
      }
    }
    balls[i].connections = currentBallConnections
  }
}

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function start() {
  if (!playing) {
    if ((X != parseInt(inputX.value)) || (Y != parseInt(inputY.value))) {
      X = parseInt(inputX.value)
      Y = parseInt(inputY.value)
      setRandomScane()
    }
    playing = true
    startButton.innerHTML = "Stop"
    requestAnimationFrame(animate);
  }
  else {
    playing = false
    startButton.innerHTML = "Start"
  }
}

function reset() {
  if(playing) {
    //?
  }
  else
  {
    inputX.value = 10
    inputX.nextElementSibling.value = 10 // output
    inputY.value = 40
    inputY.nextElementSibling.value = 40 // output

    X = parseInt(inputX.value)
    Y = parseInt(inputY.value)
    setRandomScane()
    requestAnimationFrame(animate)
  }
}

function addBall() {
  if (!playing) {
    X += 1
    balls.push(randomBall())
    calculateConnections()
    requestAnimationFrame(animate)
  }
}


function animate() {
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas_width, canvas_height);
  
  balls.forEach(ball => {
    ctx.beginPath();
    ctx.fillStyle = "#FF0000";
    ctx.arc(ball.x, ball.y, ball_radius, 0, 2 * Math.PI);
    ctx.fill();

    ball.connections.forEach(index => {
      ctx.beginPath();
      // set line color
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = connect_width;
      ctx.moveTo(ball.x, ball.y)
      ctx.lineTo(balls[index].x, balls[index].y)
      ctx.stroke();
    })
  });

  // move
  if (playing) {
    balls.forEach(ball => {
      calculateNextPosition(ball);
    })
    calculateConnections()
  }

  if (playing) {
    framesCounter++
    if (startTime == null) {
      startTime = Date.now()
    }
    else {
      if ((Date.now() - startTime) >= 1000) {
        framesPerSek = framesCounter * 1000.0 / (Date.now() - startTime)
        framesCounter = 0
        startTime = Date.now()
      }
    }
  }
  showStatistics()

  if (playing) requestAnimationFrame(animate)
}

function calculateNextPosition(ball) {
  let x = ball.x;
  let y = ball.y;
  let x_speed = ball.x_speed;
  let y_speed = ball.y_speed;

  if (mouse_position != null) {
    let d = distance(ball, { x: mouse_position.offsetX, y: mouse_position.offsetY });
    if ((d < 2 * ball_radius) && (d > 3)) {
      x_speed += ((mouse_position.offsetX - x) * 1 / d) / ball_radius;
      y_speed += ((mouse_position.offsetY - y) * 1 / d) / ball_radius;
    }
  }
  // collision
  if ((x <= ball_radius) || (x >= canvas_width - ball_radius))
    x_speed = -x_speed;
  if ((y <= ball_radius) || (y >= canvas_height - ball_radius))
    y_speed = -y_speed;

  x = x + x_speed;
  y = y + y_speed;

  // donot cross wall!
  if (x < ball_radius)
    x = ball_radius;
  if (x > canvas.width - ball_radius)
    x = canvas.width - ball_radius;
  if (y < ball_radius)
    y = ball_radius;
  if (y > canvas.height - ball_radius)
    y = canvas.height - ball_radius;

  // next possition and direction
  ball.x = x;
  ball.y = y;
  ball.x_speed = x_speed;
  ball.y_speed = y_speed;
}

function showStatistics() {
  header.innerHTML = `#Balls: ${X}, Frames per sek: ${Math.round(framesPerSek, 1)}`
}