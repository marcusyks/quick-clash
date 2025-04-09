// Room Manager
// Manages the creation of rooms, deletion of rooms

const roomManager = {
    players : {},
    rooms : {},

    // CONTROLLER

    handleRoomMessage(socket, msg){
        switch(msg){
            case 'startSoloRoom': //we start a solo room for the player and game starts immediately
                this.createSoloRoom(socket);
                break;
            case 'startVSRoom':
                break;
            default:
                break;
        }
    },

    //ROOM MANAGEMENT

    generateRoomId(type){
        return `${type}-${Date.now()}` //create timestamp room id
    },

    createSoloRoom(socket){
        // check if player is in game
        if (this.players[socket.id].inGame){
            return;
        }

        console.log(`creating solo room for user ${socket.id}`);

        //create room
        let roomID = this.generateRoomId('solo');
        this.rooms[roomID] = {
            players: [],
            gameStart: true,
        }
        this.rooms[roomID].players.push(socket.id);

        // assign to player
        this.players[socket.id].room = roomID;
        this.players[socket.id].inGame = true;
        socket.emit('startSoloGame', roomID); //signal client side to start solo game
    },

    removeRoom(roomID){
        delete this.rooms[roomID];
    },

    // PLAYER MANAGEMENT

    addPlayer(socket){
        // Add to players
        this.players[socket.id] = {
            room : null, // which room the player is in
            score: 0, // starting score
            inGame: false
        }
    },

    removePlayer(socket){
        let roomID = this.players[socket.id].room;
        if (roomID != null){
            // If player is in a room, automatically end game
            this.removeRoom(roomID);
        }
        delete this.players[socket.id];
    },
}

module.exports = { roomManager };