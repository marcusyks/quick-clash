
class ChatManager {
    io = null;

    constructor(io) {
        this.io = io;
    }

    handleChatMessage(socket, chatMsg){
        const { roomID, msg } = chatMsg;


        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // console.log(`Chat message from ${socket.id}: ${msg} at time ${currentTime}`);

        this.io.to(roomID).emit('chatMessage', {msg : msg, userID : socket.id, time: currentTime});
    }
}

module.exports = ChatManager;