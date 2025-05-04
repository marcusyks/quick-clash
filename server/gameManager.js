// Game Manager
// Manages the game states and logic

class GameManager{
    dataStorage = null;
    io = null;
    winning_combinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    gameStates = {
        0: 'Win',
        1: 'Draw',
        2: 'Loss'
    };

    constructor(dataStorage, io) {
        this.dataStorage = dataStorage;
        this.io = io;
    }

    // handleGameAction (socket, roomID)
    handleGameAction(socket, data){
        switch(data.msg){
            case 'performAction':
                this.performAction(socket, data.add);
                break;
            case 'restartGame':
                this.restartGame(socket, data.add);
                break;
            default:
                break;
        }
    }

    restartGame(socket, data) {
        const { roomID } = data;
        const room = this.dataStorage.getRoom(roomID);

        if (room) {
            room.rematchVotes += 1;

            // Check rematch votes
            let rematchVotes = room.rematchVotes;
            if (rematchVotes === 2){
                // Reset the game state
                room.board = Array(9).fill(-1);
                room.turn = Math.floor(Math.random() * 2);
                room.gameStart = true;
                room.rematchVotes = 0;
                this.io.to(roomID).emit('postGame', {status:'bothRestart'})
                this.io.to(roomID).emit('actionResults', { board: room.board, turn: room.turn});
            }
            else{
                // notify opponent that rematch was requested
                const playerIndex = room.players.indexOf(socket);
                const opponentIndex = (playerIndex + 1) % 2;
                const opponentSocket = room.players[opponentIndex];
                opponentSocket.emit('postGame', { status: 'rematch' });
            }
        }
    }

    performAction(socket, data){
        const {roomID, cellID} = data;
        // Check if room exists and whose turn it is
        const room = this.dataStorage.getRoom(roomID);
        if(room && room.gameStart){
            let player = this.dataStorage.getPlayerFromTurn(roomID, room.turn);
            if (player){ //If player turn is valid (within range)
                if (player.id !== socket.id){
                    return;
                }
                // If it is the person, then perform action
                this.dataStorage.setBoard(roomID, cellID, room.turn);
                console.log(`Player ${this.dataStorage.getRoom(roomID).players[room.turn].id} played on cell ${cellID}`);
                const prevTurn = room.turn;

                this.dataStorage.setTurn(roomID, room.turn === 0 ? 1 : 0);
                this.io.to(roomID).emit('actionResults', { board: room.board, turn: room.turn});

                // Check if player won or game over
                const winCondition = this.checkWinCondition(roomID, prevTurn);
                if (winCondition === 0){
                    for (let playerSocket of room.players) {
                        if (playerSocket.id !== socket.id) {
                            playerSocket.emit('gameOver', {status: this.gameStates[2]}); // Lose
                        }
                        else{
                            playerSocket.emit('gameOver', {status: this.gameStates[winCondition]}); //Win
                        }
                    }
                    this.dataStorage.rooms[roomID].gameStart = false;
                }

                if (winCondition === 1){
                    this.io.to(roomID).emit('gameOver', {status: this.gameStates[winCondition]}); //Draw
                    this.dataStorage.rooms[roomID].gameStart = false;
                }
            }
        }
    }


    checkWinCondition(roomID, turn){
        const room = this.dataStorage.getRoom(roomID);
        const board = room.board;

        if (board.every(cell => cell !== -1)){
            return 1; //Draw
        }
        for (const combination of this.winning_combinations) {
            const [a, b, c] = combination;
            if (board[a] === turn && board[b] === turn && board[c] === turn) {
                return 0; // Player Wins
            }
        }
    }
}

module.exports = GameManager;