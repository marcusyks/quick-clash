// Room Manager
// Manages the creation of rooms, deletion of rooms
class RoomManager {

    dataStorage = null;

    constructor(dataStorage){
        this.dataStorage = dataStorage;
    }

    // CONTROLLER
    handleRoomMessage(socket, msg){
        switch(msg){
            case 'createRoom':
                this.generateRoom(socket);
                break;
            case 'leaveRoom':
                this.deleteRoom(socket);
                break;
            default:
                break;
        }
    }

    addPlayer(socket){
        this.dataStorage.addPlayer(socket);
    }

    //ROOM MANAGEMENT
    generateRoom(socket){
        this.dataStorage.createRoom(socket);
    }

    deleteRoom(socket){
        this.dataStorage.removeRoom(socket);
    }

    deletePlayer(socket){
        this.dataStorage.removePlayer(socket);
    }
}

module.exports = RoomManager;