

export const setupRoomSocketListeners = (socket, navigate) => {
    // Listens for commands from server
    socket.once("startSoloGame",(roomID) => {
        console.log("Starting solo game for room: ", roomID);
        navigate(`/game/${roomID}`);
    })

    socket.once("createVSLobby",(roomID) => {
        console.log("Creating VS game lobby for room: ", roomID);
        navigate(`/lobby/${roomID}`);
    })

    socket.once("createVSGame",(roomID) => {
        console.log("Starting VS game for room: ", roomID);
        navigate(`/game/${roomID}`);
    })
}

export const setupGameSocketListeners = (socket, navigate) => {
    // Listens for commands from server
}