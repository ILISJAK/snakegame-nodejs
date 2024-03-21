class FoodGenerator {
    constructor(gameSize) {
        this.gameSize = gameSize;
    }

    generateFood(players) {
        let position;
        let collision;

        do {
            collision = false;
            position = {
                x: Math.floor(Math.random() * this.gameSize),
                y: Math.floor(Math.random() * this.gameSize)
            };

            Object.values(players).forEach(player => {
                player.snake.forEach(segment => {
                    if (segment.x === position.x && segment.y === position.y) {
                        collision = true;
                    }
                });
            });
        } while (collision);

        return position;
    }
}

module.exports = FoodGenerator;
