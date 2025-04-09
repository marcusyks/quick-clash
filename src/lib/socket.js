import { io } from 'socket.io-client';
import { setupRoomSocketListeners } from './listeners';

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

export const sendRoomMessage = (msg, navigate) => {
    if(msg && socket){
        // Send commands to servers
        socket.emit('roomMessage', msg);
    }

    setupRoomSocketListeners(socket, navigate);
}

export const sendGameMessage = (msg) => {
    if(msg && socket){
        socket.emit('gameMessage', msg);
    }
}