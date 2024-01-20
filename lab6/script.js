document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  let x = getRandomPosition(window.innerWidth);
  let y = getRandomPosition(window.innerHeight);
  let vx = getRandomSpeed();
  let vy = getRandomSpeed();

  function getRandomSpeed() {
    return (Math.random() - 0.5) * 10;
  }

  function getRandomPosition(max) {
    return Math.random() * max;
  }

  function drawBall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.stroke();
  }

  function updateBall() {
    x += vx;
    y += vy;

    if (x - 10 < 0 || x + 10 > canvas.width) {
      vx = -vx;
    }

    if (y - 10 < 0 || y + 10 > canvas.height) {
      vy = -vy;
    }
  }

  function animate() {
    setCanvasSize();
    updateBall();
    drawBall();
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", function () {
    setCanvasSize();
  });

  animate();
});
