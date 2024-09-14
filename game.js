const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

let gridSize = 20;
let snake = [{ x: 160, y: 160 }];
let food = { x: 0, y: 0 };
let direction = null;
let gameLoopInterval;

// Load images
const snakeHeadImg = new Image();
snakeHeadImg.src = 'images/snake_head.png';

const snakeBodyImg = new Image();
snakeBodyImg.src = 'images/snake_body.png';

const foodImg = new Image();
foodImg.src = 'images/food.png';

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    placeFood();
}

window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

function placeFood() {
    food.x = Math.floor((Math.random() * (canvas.width - gridSize)) / gridSize) * gridSize;
    food.y = Math.floor((Math.random() * (canvas.height - gridSize)) / gridSize) * gridSize;
}

function gameLoop() {
    requestAnimationFrame(gameLoop);

    // Update game state at a fixed interval
    if (++count < 6) return;
    count = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBorder();
    drawFood();
    moveSnake();
    drawSnake();
}

let count = 0;

function moveSnake() {
    let head = { ...snake[0] };

    if (direction === 'LEFT') head.x -= gridSize;
    if (direction === 'UP') head.y -= gridSize;
    if (direction === 'RIGHT') head.x += gridSize;
    if (direction === 'DOWN') head.y += gridSize;

    if (checkCollision(head)) {
        resetGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        placeFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        const img = index === 0 ? snakeHeadImg : snakeBodyImg;
        context.drawImage(img, segment.x, segment.y, gridSize, gridSize);
    });
}

function drawFood() {
    context.drawImage(foodImg, food.x, food.y, gridSize, gridSize);
}

function drawBorder() {
    context.strokeStyle = '#fff';
    context.lineWidth = 10;
    context.strokeRect(0, 0, canvas.width, canvas.height);
}

function checkCollision(part) {
    // Collision with walls
    if (
        part.x < 0 ||
        part.x + gridSize > canvas.width ||
        part.y < 0 ||
        part.y + gridSize > canvas.height
    ) {
        return true;
    }

    // Collision with self
    for (let i = 4; i < snake.length; i++) {
        if (part.x === snake[i].x && part.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    alert('Game Over!');
    snake = [{ x: 160, y: 160 }];
    direction = null;
    placeFood();
}

document.getElementById('up').addEventListener('touchstart', () => {
    if (direction !== 'DOWN') direction = 'UP';
});

document.getElementById('down').addEventListener('touchstart', () => {
    if (direction !== 'UP') direction = 'DOWN';
});

document.getElementById('left').addEventListener('touchstart', () => {
    if (direction !== 'RIGHT') direction = 'LEFT';
});

document.getElementById('right').addEventListener('touchstart', () => {
    if (direction !== 'LEFT') direction = 'RIGHT';
});

placeFood();
requestAnimationFrame(gameLoop);