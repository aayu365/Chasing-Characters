const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const timerDisplay = document.getElementById("timer");
const highScoreDisplay = document.getElementById("highScore");

const playerImg = new Image();
const enemyImg = new Image();
playerImg.src = "player.png"; 
enemyImg.src = "enemy.png";   

const player = {
  x: 100,
  y: 100,
  size: 40,
  speed: 10
};

const enemy = {
  x: 700,
  y: 500,
  size: 40,
  speed: 8
};

const keys = {};
let startTime = null;
let highScore = parseFloat(localStorage.getItem("highScore")) || 0;
highScoreDisplay.textContent = highScore.toFixed(1);

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function movePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x < canvas.width - player.size) player.x += player.speed;
  if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
  if (keys["ArrowDown"] && player.y < canvas.height - player.size) player.y += player.speed;
}

function moveEnemy() {
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const dist = Math.hypot(dx, dy);
  if (dist > 0) {
    enemy.x += (dx / dist) * enemy.speed;
    enemy.y += (dy / dist) * enemy.speed;
  }
}

function checkCollision() {
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const dist = Math.hypot(dx, dy);
  return dist < player.size;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);
  ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.size, enemy.size);
}

function update(timestamp) {
  if (!startTime) startTime = timestamp;

  const elapsed = (timestamp - startTime) / 1000;
  timerDisplay.textContent = elapsed.toFixed(1);

  movePlayer();
  moveEnemy();
  draw();

  if (checkCollision()) {
    if (elapsed > highScore) {
      highScore = elapsed;
      localStorage.setItem("highScore", highScore.toFixed(1));
      highScoreDisplay.textContent = highScore.toFixed(1);
      alert(` New High Score! You survived for ${elapsed.toFixed(1)} seconds.`);
    } else {
      alert(`Caught! You survived for ${elapsed.toFixed(1)} seconds.`);
    }
    document.location.reload();
  } else {
    requestAnimationFrame(update);
  }
}

function resetHighScore() {
  localStorage.removeItem("highScore");
  highScore = 0;
  highScoreDisplay.textContent = "0.0";
  alert("High score has been reset.");
}

playerImg.onload = () => {
  enemyImg.onload = () => {
    requestAnimationFrame(update);
  };
};
