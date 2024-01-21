let fpsSpan;
let ballsSpan;
let canvas;
let ctx;
let startBtn;
let resetBtn;
let menuContainer;
let animationOn = false;
let fpsTestCheckbox;
let pullBallsCheckbox;
let pushBallsCheckbox;
let pushpullBallsPower;
let usedIds = new Set();
let mouseXPosition;
let mouseYPosition;
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
  pullBallsCheckbox = document.querySelector("#pull-balls-checkbox");
  pushBallsCheckbox = document.querySelector("#push-balls-checkbox");
  pushpullBallsPower = document.querySelector("#push-pull-balls-power");

  startBtn.addEventListener("click", function () {
    if (animationOn == false) startAnimation();
  });
  resetBtn.addEventListener("click", startAnimation);

  canvas.addEventListener("mousemove", trackMouseMove);
  canvas.addEventListener("click", divideTheBall);
});

function trackMouseMove(e) {
  mouseXPosition = e.clientX;
  mouseYPosition = e.clientY;
}

function startAnimation() {
  animationOn = true;
  let availableHeight = window.innerHeight - menuContainer.offsetHeight;

  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = availableHeight;
  }

  function getRandomSpeedForCursor(axis, position) {
    let multiplier = pushpullBallsPower.value;
    if (pushBallsCheckbox.checked == true) {
      multiplier *= -1;
    }

    if (axis === "x") {
      if (position > mouseXPosition) return Math.random() * -multiplier;
      if (position < mouseXPosition) return Math.random() * multiplier;
    }
    if (axis === "y") {
      if (position > mouseYPosition) return Math.random() * -multiplier;
      if (position < mouseYPosition) return Math.random() * multiplier;
    }
  }

  function getRandomSpeed() {
    return (Math.random() - 0.5) * 10;
  }

  function getRandomPosition(max) {
    return Math.random() * max;
  }

  class Ball {
    constructor() {
      this.id = generateUniqueId();
      this.x = getRandomPosition(window.innerWidth);
      this.y = getRandomPosition(availableHeight);
      this.vx = getRandomSpeed();
      this.vy = getRandomSpeed();
      this.radius = 10;

      canvas.addEventListener("click", (e) => this.handleBallClick(e));
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.stroke();

      drawLines(this);
    }

    update() {
      if (pullBallsCheckbox.checked && pushBallsCheckbox.checked) {
        this.vx = getRandomSpeed();
        this.vy = getRandomSpeed();
      } else if (
        pullBallsCheckbox.checked == true ||
        pushBallsCheckbox.checked == true
      ) {
        this.vx = getRandomSpeedForCursor("x", this.x);
        this.vy = getRandomSpeedForCursor("y", this.y);
      }

      this.x += this.vx;
      this.y += this.vy;

      if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
        this.vx = -this.vx;
      }

      if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
        this.vy = -this.vy;
      }
    }

    handleBallClick(e) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const distanceToBall = calculateDistance(
        { x: mouseX, y: mouseY },
        { x: this.x, y: this.y }
      );

      if (distanceToBall < this.radius) {
        console.log("divide", this.id);
        divideTheBall(this.id);
      }
    }
  }

  function generateUniqueId() {
    let id;
    do {
      id = Math.floor(Math.random() * 1000);
    } while (usedIds.has(id));

    usedIds.add(id);
    return id;
  }

  function divideTheBall(ballId) {
    console.log("divide", ballId);
    balls = balls.filter((ball) => ball.id !== ballId);
    balls.push(new Ball());
    balls.push(new Ball());
  }

  function drawLines(currentBall) {
    let [closestBalls] = findCloseBalls(currentBall);
    if (closestBalls) {
      for (let ball of closestBalls) {
        ctx.beginPath();
        ctx.moveTo(currentBall.x, currentBall.y);
        ctx.lineTo(ball.x, ball.y);
        ctx.stroke();
      }
    }
  }

  function findCloseBalls(currentBall) {
    let closeBalls = [];

    for (const ball of balls) {
      if (ball !== currentBall) {
        const distance = calculateDistance(currentBall, ball);

        if (distance < ballsGap) {
          closestDistance = distance;
          closeBalls.push(ball);
        }
      }
    }

    return [closeBalls];
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
