document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const upButton = document.getElementById('up');
    const downButton = document.getElementById('down');
    const leftButton = document.getElementById('left');
    const rightButton = document.getElementById('right');

    canvas.width = 600;
    canvas.height = 600;

    const gridSize = 20;

    // Listen for arrow key presses to change the snake's direction
    document.addEventListener('keydown', (event) => {
        let dir = null;
        switch (event.key) {
            case 'ArrowUp': dir = 'up'; break;
            case 'ArrowDown': dir = 'down'; break;
            case 'ArrowLeft': dir = 'left'; break;
            case 'ArrowRight': dir = 'right'; break;
        }
        if (dir) {
            socket.emit('move', dir);
        }
    });

    // Function to emit a move to the server
    function emitMove(direction) {
        socket.emit('move', direction);
    }

    // Listen for touch events on buttons
    upButton.addEventListener('click', () => emitMove('up'));
    downButton.addEventListener('click', () => emitMove('down'));
    leftButton.addEventListener('click', () => emitMove('left'));
    rightButton.addEventListener('click', () => emitMove('right'));

    // Function to draw the game state as received from the server
    function drawGame(state) {
        // Fill background with black
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw all snakes
        Object.values(state.players).forEach(player => {
            drawSnake(player.snake);
        });

        // Draw the food
        drawFood(state.food);
    }

    function drawSnake(snake) {
        ctx.fillStyle = 'green';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
    }

    function drawFood(food) {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    // Update and draw the game based on server state
    socket.on('gameState', (state) => {
        drawGame(state);
    });
});
