let fpsSpan;
let ballsSpan;
let canvas;
let ctx;
let startBtn;
let stopBtn;
let menuContainer;
let animationOn = false;
let fpsTestCheckbox;
let ballsGap = 550;

document.addEventListener("DOMContentLoaded", (event) => {
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");
  fpsSpan = document.querySelector("#fps-span");
  menuContainer = document.querySelector("#menu");
  ballsSpan = document.querySelector("#balls-number-span");
  startBtn = document.querySelector("#start-btn");
  resetBtn = document.querySelector("#reset-btn");
  fpsTestCheckbox = document.querySelector("#fps-test-checkbox");

  startBtn.addEventListener("click", function () {
    if (animationOn == false) startAnimation();
  });
  resetBtn.addEventListener("click", startAnimation);
});

function startAnimation() {
  animationOn = true;
  let availableHeight = window.innerHeight - menuContainer.offsetHeight;

  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = availableHeight;
  }

  function getRandomSpeed() {
    return (Math.random() - 0.5) * 10;
  }

  function getRandomPosition(max) {
    return Math.random() * max;
  }

  class Ball {
    constructor() {
      this.x = getRandomPosition(window.innerWidth);
      this.y = getRandomPosition(availableHeight);
      this.vx = getRandomSpeed();
      this.vy = getRandomSpeed();
      this.radius = 10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.stroke();

      drawLines(this);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
        this.vx = -this.vx;
      }

      if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
        this.vy = -this.vy;
      }

      updateLines();
    }
  }

  function drawLines(currentBall) {
    let [closestBall, distance] = findClosestBall(currentBall);
    if (closestBall && distance < ballsGap) {
      ctx.beginPath();
      ctx.moveTo(currentBall.x, currentBall.y);
      ctx.lineTo(closestBall.x, closestBall.y);
      ctx.stroke();
    }
  }

  function updateLines() {
    balls.forEach((ball) => {});
  }

  function findClosestBall(currentBall) {
    let closestBall = null;
    let closestDistance = Infinity;

    for (const ball of balls) {
      if (ball !== currentBall) {
        const distance = calculateDistance(currentBall, ball);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestBall = ball;
        }
      }
    }
    console.log(closestBall);
    return [closestBall, closestDistance];
  }

  function calculateDistance(ball1, ball2) {
    const dx = ball1.x - ball2.x;
    const dy = ball1.y - ball2.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  let balls = Array.from({ length: 5 }, () => new Ball());

  function drawBalls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (fpsTestCheckbox.checked == true) {
      if (fps > 60) {
        balls.push(new Ball());
      } else if (fps < 60) {
        balls.pop();
      }
    }

    ballsSpan.innerHTML = balls.length;
    balls.forEach((ball) => ball.draw());
  }

  function updateBalls() {
    balls.forEach((ball) => ball.update());
  }

  function animate() {
    setCanvasSize();
    updateBalls();
    drawBalls();
    fpsSpan.textContent = fps;
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", function () {
    setCanvasSize();
  });

  animate();
}

const times = [];
let fps;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    refreshLoop();
  });
}

refreshLoop();
