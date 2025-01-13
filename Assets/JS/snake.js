const canvas = document.getElementById("snake-gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = 400;
let snake;
let food;
let dx = gridSize;
let dy = 0;
let score = 0;
let gameInterval;
let isGameRunning = false;
let gameTime = 0; // Track elapsed time in seconds
let speedInterval = 100; // Initial interval (100ms)

// Elements for game status and buttons
const startBtn = document.getElementById("startBtnSnake");
const retryBtn = document.getElementById("retryBtnSnake");
const gameOverMessage = document.getElementById("gameOverMessage");
const finalScore = document.getElementById("finalScore");

// Initialize the game state
function initializeGame() {
  snake = [{ x: 160, y: 160 }];
  food = { x: 200, y: 200 };
  dx = gridSize;
  dy = 0;
  score = 0;
  gameTime = 0;
  gameOverMessage.style.display = "none";
  retryBtn.style.display = "none";
}

// Draw the snake with a color gradient from dark green to lime
function drawSnake() {
  const headColor = "#006400"; // Dark green color (head)
  const tailColor = "#00FF00"; // Lime green color (tail)

  snake.forEach((segment, index) => {
    // Calculate the color factor based on the segment's position
    const colorFactor = index / snake.length; // Head is 0, tail is 1
    const segmentColor = interpolateColor(headColor, tailColor, colorFactor);

    ctx.fillStyle = segmentColor; // Apply the interpolated color
    console.log(segmentColor);
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });
}

// Draw the food
function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Move the snake
function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Game over if snake hits walls or itself
  if (
    head.x < 0 ||
    head.x >= canvasSize ||
    head.y < 0 ||
    head.y >= canvasSize ||
    isCollision(head)
  ) {
    clearInterval(gameInterval);
    gameOverMessage.style.display = "block";
    finalScore.textContent = score;
    retryBtn.style.display = "inline-block";
    isGameRunning = false;
    return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    spawnFood();
  } else {
    snake.pop();
  }
}

// Check if the snake collides with itself
function isCollision(head) {
  return snake.some(
    (segment, index) =>
      index !== 0 && segment.x === head.x && segment.y === head.y
  );
}

// Spawn food at a random position
function spawnFood() {
  let newFoodPosition;

  do {
    newFoodPosition = {
      x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
    };
  } while (isFoodOnSnake(newFoodPosition));

  food = newFoodPosition;
}

// Check if the food position is on the snake's body
function isFoodOnSnake(foodPosition) {
  return snake.some(
    (segment) => segment.x === foodPosition.x && segment.y === foodPosition.y
  );
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize); // Clear the canvas
  drawSnake();
  drawFood();
}

// Update the game state
function update() {
  gameTime++; // Increment elapsed time by 1 (every 100ms)

  // Increase speed every 10 seconds
  if (gameTime % 100 === 0 && (gameTime / 100) % 10 === 0) {
    speedInterval = Math.max(50, speedInterval - 10); // Decrease interval but keep it above 50ms
    clearInterval(gameInterval); // Clear the existing interval
    gameInterval = setInterval(update, speedInterval); // Restart the game loop with the new speed
  }

  moveSnake();
  draw();
}

// Control the snake's direction using the arrow keys
document.addEventListener("keydown", (e) => {
  // Only prevent default if the game is running
  if (isGameRunning) {
    e.preventDefault();

    if (e.key === "ArrowUp" && dy === 0) {
      dx = 0;
      dy = -gridSize;
    } else if (e.key === "ArrowDown" && dy === 0) {
      dx = 0;
      dy = gridSize;
    } else if (e.key === "ArrowLeft" && dx === 0) {
      dx = -gridSize;
      dy = 0;
    } else if (e.key === "ArrowRight" && dx === 0) {
      dx = gridSize;
      dy = 0;
    }
  }
});

// Start the game when the "Start Game" button is clicked
startBtn.addEventListener("click", () => {
  if (!isGameRunning) {
    isGameRunning = true;
    initializeGame();
    startBtn.style.display = "none"; // Hide the start button once clicked
    gameInterval = setInterval(update, speedInterval); // Start the game loop
  }
});

// Restart the game when the "Retry" button is clicked
retryBtn.addEventListener("click", () => {
  initializeGame();
  gameOverMessage.style.display = "none"; // Hide the game over message
  startBtn.style.display = "none"; // Hide the start button
  isGameRunning = true;
  gameInterval = setInterval(update, speedInterval); // Restart the game loop
});

// Function to interpolate between two colors
function interpolateColor(startColor, endColor, factor) {
  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);

  const r = Math.round(start.r + (end.r - start.r) * factor);
  const g = Math.round(start.g + (end.g - start.g) * factor);
  const b = Math.round(start.b + (end.b - start.b) * factor);

  return rgbToHex(r, g, b);
}

// Helper function to convert hex color to RGB
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// Helper function to convert RGB to hex
// Helper function to convert RGB to hex
function rgbToHex(r, g, b) {
  // Ensure each component is padded with leading zeros if necessary
  const red = r.toString(16).padStart(2, "0");
  const green = g.toString(16).padStart(2, "0");
  const blue = b.toString(16).padStart(2, "0");

  // Return the hex code
  return `#${red}${green}${blue}`;
}
