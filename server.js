const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const gameSize = 30; // Assuming a 20x20 game grid
let players = {};
let food = { x: Math.floor(Math.random() * gameSize), y: Math.floor(Math.random() * gameSize) }; // Initial food position

function generateFood() {
  let position;
  let collision;

  do {
    collision = false;
    // Generate a random position for the food
    position = {
      x: Math.floor(Math.random() * gameSize),
      y: Math.floor(Math.random() * gameSize)
    };

    // Check if the food spawns on any of the snakes
    Object.values(players).forEach(player => {
      player.snake.forEach(segment => {
        if (segment.x === position.x && segment.y === position.y) {
          collision = true;
        }
      });
    });
  } while (collision); // Keep generating new positions until it doesn't collide

  food = position; // Set the new food position
}


io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  if (!players[socket.id]) {
    players[socket.id] = {
      snake: [{ x: Math.floor(gameSize / 2), y: Math.floor(gameSize / 2) }],
      direction: 'right',
      score: 0,
    };
  }

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit('updatePlayers', players);
  });

  socket.on('move', (newDirection) => {
    const player = players[socket.id];
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
  });
});

// Game loop
setInterval(() => {
    Object.keys(players).forEach(id => {
        const player = players[id];
        const head = { x: player.snake[0].x, y: player.snake[0].y };

        // Move the snake's head based on the direction
        switch (player.direction) {
            case 'left': head.x -= 1; break;
            case 'up': head.y -= 1; break;
            case 'right': head.x += 1; break;
            case 'down': head.y += 1; break;
        }

        // Check for collisions with the game borders
        if (head.x < 0 || head.y < 0 || head.x > gameSize - 1 || head.y > gameSize - 1) {
            // Reset snake position and score if it hits the border
            player.snake = [{ x: Math.floor(gameSize / 2), y: Math.floor(gameSize / 2) }];
            player.direction = 'right';
            player.score = 0;
            generateFood(); // Generate new food when a snake dies
        } else {
            // Add the new head to the snake
            player.snake.unshift(head);

            // Check for collision with food
            if (head.x === food.x && head.y === food.y) {
                player.score += 10;
                player.snake.unshift({x: head.x, y: head.y}); // Keep the head to grow the snake
                generateFood(); // Generate new food after being eaten
            } else {
                // Remove the last segment if no food is eaten
                player.snake.pop();
            }
        }
    });

    io.emit('gameState', { players, food });
}, 1000 / 10);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
