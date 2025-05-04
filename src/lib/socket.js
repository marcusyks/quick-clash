import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
    if (!socket) {
        socket = io(process.env.REACT_APP_SERVER_API, {
            withCredentials: true,
            autoConnect: true
        });
    }

    return socket;
};

export const socketConnected = () => {
    if (!socket) {
        return false;
    }
    return true;
}

export const sendRoomMessage = (msg) => {
    if(msg && socket){
        // Send commands to servers
        socket.emit('roomMessage', msg);
    }
}

export const sendGameMessage = (msg, add) => {
    if (msg && add && socket){
        const data = {msg, add}
        socket.emit('gameMessage', data);
    }
}