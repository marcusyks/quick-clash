const crypto = require("crypto");

class DataStorage {
    players = {}
    rooms = {}

    // GAME

    setBoard(roomID, cellID, turn){
        // Check if room exists
        const room = this.getRoom(roomID);
        if (room) {
            // Check if cellID is valid
            if (cellID >= 0 && cellID < room.board.length) {
                // Check if cell is empty
                if (room.board[cellID] === -1) {
                    room.board[cellID] = turn; // set board to player turn
                }
            }
        }
    }

    setTurn(roomID, turn){
        const room = this.getRoom(roomID);
        if(room){
            room.turn = turn
        }
    }

    // ROOMS
    generateRoomId(type){
        let uuid = crypto.randomUUID(); //generate a uuid
        return `${type}_${uuid}` //create timestamp room id
    }

    getRoom(roomID){
        return this.rooms[roomID];
    }

    createRoom(socket){
        // check if player is in game
        const player = this.getPlayer(socket);
        if (player.inGame === 'waiting' || player.inGame === 'inGame'){
            return;
        }

        // Check if there any rooms available
        for (let roomID in this.rooms){
            let room = this.getRoom(roomID)
            if (room.players.length < 2 && !room.gameStart){
                // add player to room
                socket.join(roomID);

                room.players.push(socket);
                room.gameStart = true;

                player.room = roomID;
                for (let i = 0; i < room.players.length; i++) {
                    let playerSocket = this.rooms[roomID].players[i];

                    this.players[playerSocket.id].inGame = 'inGame';
                    playerSocket.emit('startGame', {
                        roomID,
                        playerTurn: i,
                        turn: this.rooms[roomID].turn,
                    });
                }
                return;
            }
        }

        console.log(`Creating room and add user ${socket.id}`);

        //create room
        let roomID = this.generateRoomId('VS');
        this.rooms[roomID] = {
            players: [],
            board: Array(9).fill(-1),
            turn: Math.floor(Math.random() * 2),
            gameStart: false,
            rematchVotes: 0
        }
        this.rooms[roomID].players.push(socket);

        // assign to player
        player.room = roomID;
        player.inGame = 'waiting';
        socket.emit('waitGame', roomID); // signal client side that player is waiting
        socket.join(roomID);
    }

    removeRoom(socket){
        const player = this.getPlayer(socket);
        const roomID = player.room;
        const room = this.getRoom(roomID);

        if (roomID != null && room) {
            // If player is in a room, automatically end game
            for (let playerSocket of room.players) {
                if (playerSocket.id !== socket.id) {
                    let currPlayer = this.getPlayer(playerSocket);
                    currPlayer.inGame = null; // set other player to not in game
                    if (room.gameStart){
                        playerSocket.emit('forceStop', socket.id); // signal client side that player left
                    }
                    else{
                        playerSocket.emit('postGame', {status: 'opponentLeft'});
                    }
                }
            }
            socket.leave(roomID)
            delete this.rooms[roomID]; // delete room
        }
        player.inGame = null;
    }


    // PLAYERS
    getPlayer(socket){
        return this.players[socket.id]
    }

    addPlayer(socket){
        // Add to players
        this.players[socket.id] = {
            room : null, // which room the player is in
            inGame: null
        }
    }

    removePlayer(socket){
        const playerData = this.getPlayer(socket);
        if (!playerData) {
            console.warn(`Player ${socket.id} not found in players list`);
            return;
        }

        const roomID = playerData.room;
        if (roomID) {
            this.removeRoom(socket, roomID); // remove room if player is in a room
            socket.leave(roomID)
        }
        delete this.players[socket.id];
    }

    removePlayerFromRoom(socket){
        const playerData = this.getPlayer(socket);
        if (!playerData) {
            console.warn(`Player ${socket.id} not found in players list`);
            return;
        }

        const roomID = playerData.room;
        if (roomID) {
            this.removeRoom(socket, roomID); // remove room if player is in a room
            socket.leave(roomID)
        }
    }

    getPlayerFromTurn(roomID, turn){
        const room = this.getRoom(roomID)
        if (turn >= 0 && turn < room.players.length) {
            return room.players[turn];
        }
    }

    getPlayerTurn(roomID, socket){
        const room = this.getRoom(roomID);
        if (room) {
            for (let i = 0; i < room.players.length; i++) {
                if (room.players[i] === socket) {
                    return i;
                }
            }
        }
    }
}

module.exports = DataStorage;