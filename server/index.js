const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { gameManager } = require("./gameManager.js");
const { roomManager } = require("./roomManager.js");
var cors = require("cors");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_API,
  credentials: true
}))

const httpServer = createServer(app);
const port = process.env.PORT;

const io = new Server(httpServer, {
  cors:{
    origin: process.env.FRONTEND_API,
    credentials: true
  }
});


io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected!`);

  roomManager.addPlayer(socket);

  // Listen for messages from the client
  // socket.on("gameMessage", (data) => {
  //   gameManager.handleGameAction(socket, data);
  // });
  socket.on("roomMessage", (data) => {
    roomManager.handleRoomMessage(socket, data);
  });

  // Handles disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected!`);
    roomManager.removePlayer(socket); // Remove player from the game state
  });
});

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
});