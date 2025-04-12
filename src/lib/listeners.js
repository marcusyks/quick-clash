/**
 * Lists out all the room and game event handlers for the socket
 * @param {*} navigate 
 * @returns
 */

const roomEventHandlers = (navigate) => ({
    startSoloGame: (roomID) => {
        console.log("Starting solo game for room:", roomID);
        navigate(`/game/${roomID}`);
    },
    createVSLobby: (roomID) => {
        console.log("Creating VS game lobby for room:", roomID);
        navigate(`/lobby/${roomID}`);
    },
    createVSGame: (roomID) => {
        console.log("Starting VS game for room:", roomID);
        navigate(`/game/${roomID}`);
    },
});

const gameEventHandler = (navigate) => ({

});

/**
 * Set ups the event handlers and deletes all when done
 * @param {*} socket
 * @param {*} navigate
 */

export const setupRoomSocketListeners = (socket, navigate) => {
    const roomHandlers = roomEventHandlers(navigate);

    const cleanupListeners = () => {
        Object.keys(roomHandlers).forEach(event => {
            socket.removeAllListeners(event);
        });
    };

    // Attach each listener once, and remove all listeners once any of them fires
    Object.entries(roomHandlers).forEach(([event, handler]) => {
        socket.once(event, (roomID) => {
            cleanupListeners();
            handler(roomID);
        });
    });
};

export const setupGameSocketListeners = (socket, navigate) => {
    const gameHandlers = gameEventHandler(navigate);

    const cleanupListeners = () => {
        Object.keys(gameHandlers).forEach(event => {
            socket.removeAllListeners(event);
        });
    };

    // Attach each listener once, and remove all listeners once any of them fires
    Object.entries(gameHandlers).forEach(([event, handler]) => {
        socket.once(event, (roomID) => {
            cleanupListeners();
            handler(roomID);
        });
    });
};
