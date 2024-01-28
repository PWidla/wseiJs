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
let ballsGap = 250;
let balls = [];

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
  xValue = document.querySelector("#x-value");
  yValue = document.querySelector("#y-value");

  startBtn.addEventListener("click", function () {
    if (animationOn === false) startAnimation();
  });
  resetBtn.addEventListener("click", startAnimation);

  canvas.addEventListener("mousemove", trackMouseMove);
});

function trackMouseMove(e) {
  mouseXPosition = e.clientX;
  mouseYPosition = e.clientY;
}

function resetBallsVelocity() {
  balls.forEach((ball) => {
    ball.vx = 0;
    ball.vy = 0;
  });
}

function startAnimation() {
  animationOn = true;
  resetBallsVelocity();
  let availableHeight = window.innerHeight - menuContainer.offsetHeight;

  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = availableHeight;
  }

  function getSpeedForCursor(axis, position) {
    let multiplier = pushpullBallsPower.value;
    if (pushBallsCheckbox.checked === true) {
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

  function getSpeed(power) {
    const r = Math.random();
    if (r > 0.5) {
      power *= -1;
    }
    return 10 / power;
  }

  function getRandomPosition(max, radius) {
    const minDistance = radius + 10;

    return Math.random() * (max - 2 * minDistance) + minDistance;
  }

  function getRandomPower() {
    return Math.random() * 30;
  }

  class Ball {
    constructor() {
      this.id = generateUniqueId();
      this.power = getRandomPower();
      this.x = getRandomPosition(window.innerWidth, this.power);
      this.y = getRandomPosition(availableHeight, this.power);
      this.vx = getSpeed(this.power);
      this.vy = getSpeed(this.power);
      this.radius = this.power;
      this.transferBalls = [];

      canvas.addEventListener("click", (e) => this.handleBallClick(e));
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.stroke();

      drawLines(this);
    }

    update() {
      if (this.power === 0) {
        balls = balls.filter((ball) => ball.id !== this.id);
        return;
      }

      if (pullBallsCheckbox.checked && pushBallsCheckbox.checked) {
        this.vx = getSpeed(this.power);
        this.vy = getSpeed(this.power);
      } else if (
        pullBallsCheckbox.checked === true ||
        pushBallsCheckbox.checked === true
      ) {
        this.vx = getSpeedForCursor("x", this.x);
        this.vy = getSpeedForCursor("y", this.y);
      }

      this.x += this.vx;
      this.y += this.vy;
      this.radius = this.power;

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
        divideTheBall(this.id);
      }
    }
  }

  function divideTheBall(ballId) {
    balls = balls.filter((ball) => ball.id !== ballId);
    balls.push(new Ball());
    balls.push(new Ball());
  }

  function generateUniqueId() {
    let id;
    do {
      id = Math.floor(Math.random() * 1000);
    } while (usedIds.has(id));

    usedIds.add(id);
    return id;
  }

  function drawLines(currentBall) {
    let [closestBalls] = findCloseBalls(currentBall);
    if (closestBalls) {
      for (let ball of closestBalls) {
        ctx.beginPath();
        ctx.moveTo(currentBall.x, currentBall.y);
        ctx.lineTo(ball.x, ball.y);
        ctx.stroke();

        if (
          ball.power !== currentBall.power &&
          !ball.transferBalls.includes(currentBall.id)
        ) {
          ball.transferBalls.push(currentBall.id);
          transferPower(ball, currentBall);
        }
      }
    }
  }

  function transferPower(source, target) {
    if (fpsTestCheckbox.checked == true) {
      return;
    }

    setTimeout(() => {
      const forceSource =
        xValue.value * getCurrentSpeed(source) + yValue.value * source.radius;
      const forceTarget =
        xValue.value * getCurrentSpeed(target) + yValue.value * target.radius;

      let stronger, weaker;
      if (forceSource > forceTarget) {
        stronger = source;
        weaker = target;
      } else {
        stronger = target;
        weaker = source;
      }

      stronger.power += weaker.power;
      weaker.power = 0;

      stronger.vx = stronger.vx.toFixed(3) * 0.9;
      stronger.vy = stronger.vy.toFixed(3) * 0.9;
    }, 1000);
  }

  function getCurrentSpeed(ball) {
    return Math.sqrt(ball.vx ** 2 + ball.vy ** 2);
  }

  function findCloseBalls(currentBall) {
    let closeBalls = [];

    for (const ball of balls) {
      if (ball !== currentBall) {
        const distance = calculateDistance(currentBall, ball);

        if (distance < ballsGap) {
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

  function drawBalls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (fpsTestCheckbox.checked === true) {
      if (fps > 60) {
        balls.push(new Ball());
      } else if (fps < 60 && balls.length > 0) {
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

  balls = Array.from({ length: 4 }, () => new Ball());
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
