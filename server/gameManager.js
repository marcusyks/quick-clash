// Game Manager
// Manages the game states and logic

const gameManager = {
    players : {},
    rooms : {},

    // PLAYER MANAGEMENT
    addPlayer(socket){
        // Add to players
        this.players[socket.id] = {
            room : null, // which room the player is in
            username : 'user', // for now
            score: 0, // starting score
            inGame: false
        }
    },

    removePlayer(socket){
        let room = this.players[socket.id].room;
        if (room != null){
            // If player is in a room, automatically end game
        }
        delete this.players[socket.id];
    },

    // ROOM MANAGEMENT

    // GAME LOGIC
}

module.exports = { gameManager };