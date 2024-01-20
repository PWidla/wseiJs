let fpsSpan;
let ballsSpan;
let canvas;
let ctx;
let startBtn;
let stopBtn;
let menuContainer;

document.addEventListener("DOMContentLoaded", (event) => {
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");
  fpsSpan = document.querySelector("#fps-span");
  menuContainer = document.querySelector("#menu");
  ballsSpan = document.querySelector("#balls-number-span");
  startBtn = document.querySelector("#start-btn");
  stopBtn = document.querySelector("#stop-btn");

  startBtn.addEventListener("click", startAnimation);
});

function startAnimation() {
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
    }
  }

  let balls = Array.from({ length: 2 }, () => new Ball());

  function drawBalls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // if (fps > 60) {
    //   balls.push(new Ball());
    // } else if (fps < 60) {
    //   balls.pop();
    // }

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
