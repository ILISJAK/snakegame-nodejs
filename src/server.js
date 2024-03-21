const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const GameManager = require('./game/GameManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const gameManager = new GameManager(30);

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);
  gameManager.addPlayer(socket.id);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    gameManager.removePlayer(socket.id);
    io.emit('updatePlayers', gameManager.getGameState().players);
  });

  socket.on('move', (newDirection) => {
    gameManager.updateDirection(socket.id, newDirection);
  });
});

setInterval(() => {
  gameManager.updateGame();
  io.emit('gameState', gameManager.getGameState());
}, 1000 / 10);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
