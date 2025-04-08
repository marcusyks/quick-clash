const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { gameManager } = require("./gameManager.js");
const { chatManager } = require("./chatManager.js");

const app = express();
const httpServer = createServer(app);
const port = 5000;
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("A user connected!");

  gameManager.addPlayer(socket);

  chatManager.addPlayer(socket);

  // Listen for messages from the client
  // socket.on("gameAction", (data) => {
  //   gameManager.handleGameAction(socket, data);
  // });

  // socket.on("chatMessage", (data) => {
  //   chatManager.handleChatMessage(socket, data);
  // });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    gameManager.removePlayer(socket); // Remove player from the game state
    chatManager.removePlayer(socket); // Remove player from chat
    });
});

httpServer.listen(port, () => {
    console.log(`listening on port ${port}`);
});