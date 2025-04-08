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

export const sendRoomMessage = (msg) => {
    if(msg && socket){
        socket.emit('roomMessage', msg);
    }
}

export const sendGameMessage = (msg) => {
    if(msg && socket){
        socket.emit('gameMessage', msg);
    }
}