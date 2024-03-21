const FoodGenerator = require('./FoodGenerator');

class GameManager {
    constructor(gameSize) {
        this.gameSize = gameSize;
        this.players = {};
        this.foodGenerator = new FoodGenerator(gameSize);
        this.food = this.foodGenerator.generateFood(this.players);
    }

    addPlayer(socketId) {
        if (!this.players[socketId]) {
            this.players[socketId] = {
                snake: [{ x: Math.floor(this.gameSize / 2), y: Math.floor(this.gameSize / 2) }],
                direction: 'right',
                score: 0,
            };
        }
    }

    removePlayer(socketId) {
        delete this.players[socketId];
    }

    updateDirection(socketId, newDirection) {
        const player = this.players[socketId];
        if (player) {
            const oppositeDirection = {
                'up': 'down',
                'down': 'up',
                'left': 'right',
                'right': 'left',
            };
            if (player.direction !== oppositeDirection[newDirection]) {
                player.direction = newDirection;
            }
        }
    }

    updateGame() {
        Object.keys(this.players).forEach(id => {
            const player = this.players[id];
            const head = { x: player.snake[0].x, y: player.snake[0].y };

            // Move the snake's head based on the direction
            switch (player.direction) {
                case 'left': head.x -= 1; break;
                case 'up': head.y -= 1; break;
                case 'right': head.x += 1; break;
                case 'down': head.y += 1; break;
            }

            // Check for collisions with the game borders
            if (head.x < 0 || head.y < 0 || head.x >= this.gameSize || head.y >= this.gameSize) {
                // Reset snake position and score if it hits the border
                player.snake = [{ x: Math.floor(this.gameSize / 2), y: Math.floor(this.gameSize / 2) }];
                player.direction = 'right';
                player.score = 0;
                this.food = this.foodGenerator.generateFood(this.players); // Generate new food
            } else {
                // Add the new head to the snake
                player.snake.unshift(head);

                // Check for collision with food
                if (head.x === this.food.x && head.y === this.food.y) {
                    player.score += 10;
                    // The snake grows, so we don't remove the last segment
                    this.food = this.foodGenerator.generateFood(this.players); // Generate new food
                } else {
                    // Remove the last segment if no food is eaten
                    player.snake.pop();
                }
            }
        });
    }

    getGameState() {
        return { players: this.players, food: this.food };
    }
}

module.exports = GameManager;
