document.addEventListener('DOMContentLoaded', () => {
    // Establish connection with the server using Socket.IO
    const socket = io();

    // Function to emit move commands to the server
    function emitMove(direction) {
        socket.emit('move', direction);
    }

    // Attach the emitMove function to the window object to make it accessible from game.js
    window.emitMove = emitMove;

    // Listen for game state updates from the server
    socket.on('gameState', (state) => {
        // Call the drawGame function from game.js to render the new game state
        if (window.drawGame) {
            window.drawGame(state);
        } else {
            console.error('drawGame function is not available');
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
        // Here, you might want to update the UI to inform the player that they've been disconnected.
    });
});
