
const header = document.querySelector("#header");
const record = document.querySelector("#record")
const canvas = document.querySelector("#table");

var vector = {x: 0.0, y:0.0}
var ball1 = {x: 100.0, y: 180.0}
var hole = {x: 500.0, y: 300.0}
const ball_radius = 50
const hole_radius = ball_radius * 5.0 / 4.0
const factor = 3.0
var worldRecord = 0.0
var lastTime = 0.0

// state of game
var ballInTheHole = true  // stopped
var startTime = Date.now()

showRecord()
window.addEventListener("deviceorientation", onDeviceMove);
requestAnimationFrame(animate);

function start() {
  if (ballInTheHole) {
    ball1 = {x: 100.0, y: 180.0}
    startTime = Date.now()
    ballInTheHole = false
    requestAnimationFrame(animate);
  }
}

function onDeviceMove(event) {
  const rotateDegrees = event.alpha || 0 // alpha: rotation around z-axis
  const frontToBack = event.beta || 90 // beta: front back motion
  const leftToRight = event.gamma || 0 // gamma: left to right

  header.innerHTML = `rotateDegrees= ${rotateDegrees} (0 - 360)/ frontToBack= ${frontToBack} (-180 - 180)/ leftToRight= ${leftToRight} (-90 - 90)`;

  vector.x = leftToRight / 90.0
  vector.y = (frontToBack - 90.0) / 180.0

  console.log("vector", vector.x, vector.y);
}

function animate() {
  let x_center = canvas.width/2
  let y_center = canvas.height/2
  
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath()
  ctx.arc(x_center, y_center, 3, 0, 2*Math.PI)
  ctx.moveTo(x_center, y_center)
  ctx.lineTo(x_center + vector.x * 100.0, y_center + vector.y * 100.0)
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = "#00FF00";
  ctx.arc(hole.x, hole.y, hole_radius, 0, 2 * Math.PI);
  ctx.stroke();

  let x = ball1.x + vector.x * factor
  let y = ball1.y + vector.y * factor

  if (x < ball_radius) x = ball_radius
  if (x > canvas.width - ball_radius) x = canvas.width - ball_radius
  if (y < ball_radius) y = ball_radius
  if (y > canvas.height - ball_radius) y = canvas.height - ball_radius

  ball1.x = x
  ball1.y = y

  ctx.beginPath();
  ctx.fillStyle = "#FF0000";
  ctx.arc(ball1.x, ball1.y, ball_radius, 0, 2 * Math.PI);
  ctx.fill();

  console.log("ball", x, y)

  // (center of ball1) distance to (center of hole)
  if (!ballInTheHole) { 
    if (Math.sqrt((ball1.x - hole.x) ** 2 + (ball1.y - hole.y) ** 2) < (hole_radius - ball_radius)) {
      ballInTheHole = true
      lastTime = Date.now() - startTime
      if (worldRecord == 0 || worldRecord > lastTime)
        worldRecord = lastTime
    }
  }

  showRecord()

  if (!ballInTheHole) requestAnimationFrame(animate);
}


function showRecord() {
  if (!ballInTheHole)
    record.innerHTML = `World record: ${worldRecord/1000.0}sek, Last time: ${(Date.now() - startTime)/1000.0}sek`
  else 
    record.innerHTML = `World record: ${worldRecord/1000.0}sek, Last time: ${lastTime/1000.0}sek`
}
