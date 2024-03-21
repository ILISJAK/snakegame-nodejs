document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const upButton = document.getElementById('up');
    const downButton = document.getElementById('down');
    const leftButton = document.getElementById('left');
    const rightButton = document.getElementById('right');

    // Set canvas size
    canvas.width = 600;
    canvas.height = 600;

    // Grid size for the game
    const gridSize = 20;


    function drawGame(state) {
        // Fill background with black
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw all snakes
        Object.values(state.players).forEach(player => { // Adjusted line
            drawSnake(player.snake);
        });

        // Draw the food
        drawFood(state.food);
    }

    // Draw a snake on the canvas
    function drawSnake(snake) {
        ctx.fillStyle = 'green';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
    }

    // Draw food on the canvas
    function drawFood(food) {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    // Listen for arrow key presses
    document.addEventListener('keydown', (event) => {
        let dir = null;
        switch (event.key) {
            case 'ArrowUp': dir = 'up'; break;
            case 'ArrowDown': dir = 'down'; break;
            case 'ArrowLeft': dir = 'left'; break;
            case 'ArrowRight': dir = 'right'; break;
        }
        if (dir) {
            window.emitMove(dir); // Use the global emitMove function
        }
    });

    // Attach event listeners to control buttons
    upButton.addEventListener('click', () => window.emitMove('up'));
    downButton.addEventListener('click', () => window.emitMove('down'));
    leftButton.addEventListener('click', () => window.emitMove('left'));
    rightButton.addEventListener('click', () => window.emitMove('right'));

    // Make drawGame globally accessible
    window.drawGame = drawGame;
});
