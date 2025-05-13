
class ChatManager {
    io = null;

    constructor(io) {
        this.io = io;
    }

    handleChatMessage(socket, chatMsg){
        const { roomID, msg } = chatMsg;

        // console.log(roomID, msg);

        this.io.to(roomID).emit('chatMessage', {msg : msg, userID : socket.id});
    }
}

module.exports = ChatManager;