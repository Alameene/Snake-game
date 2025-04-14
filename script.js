const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 20;
const numRows = canvas.height / cellSize;
const numCols = canvas.width / cellSize;

let snake = [{ x: numCols / 2, y: numRows / 2 }];
let food = { x: Math.floor(Math.random() * numCols), y: Math.floor(Math.random() * numRows) };
let dx = 0;
let dy = 0;

document.addEventListener("keydown", changeDirection);
canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchend", handleTouchEnd);

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
}

function handleSwipe() {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0) {
            // Swipe right
            changeDirection({ key: "ArrowRight" });
        } else {
            // Swipe left
            changeDirection({ key: "ArrowLeft" });
        }
    } else {
        // Vertical swipe
        if (dy > 0) {
            // Swipe down
            changeDirection({ key: "ArrowDown" });
        } else {
            // Swipe up
            changeDirection({ key: "ArrowUp" });
        }
    }
}

function changeDirection(event) {
    const key = event.key;
    if (key === "ArrowUp" && dy !== 1) {
        dx = 0;
        dy = -1;
    } else if (key === "ArrowDown" && dy !== -1) {
        dx = 0;
        dy = 1;
    } else if (key === "ArrowLeft" && dx !== 1) {
        dx = -1;
        dy = 0;
    } else if (key === "ArrowRight" && dx !== -1) {
        dx = 1;
        dy = 0;
    }
}

function drawSnake() {
    ctx.fillStyle = "#0f0";
    snake.forEach(segment => {
        ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
    });
}

function drawFood() {
    ctx.fillStyle = "#f00";
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * numCols);
    food.y = Math.floor(Math.random() * numRows);
}

function checkCollision() {
    const head = snake[0];
    return (
        head.x < 0 || head.x >= numCols ||
        head.y < 0 || head.y >= numRows ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();
    if (checkCollision()) {
        clearInterval(gameLoop);
        alert("Game Over!");
    }
}

const gameLoop = setInterval(draw, 100);
