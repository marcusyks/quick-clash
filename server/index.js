const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const RoomManager = require("./roomManager.js");
const GameManager = require("./gameManager.js");
const DataStorage = require("./dataStorage.js");
var cors = require("cors");
const path = require('path');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_API,
  credentials: true
}))

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../src/dist')));

// Handle requests by serving index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/dist', 'index.html'));
});

const httpServer = createServer(app);
const port = process.env.PORT;

const io = new Server(httpServer, {
  cors:{
    origin: process.env.FRONTEND_API,
    credentials: true
  }
});

const dataStorage = new DataStorage();
const roomManager = new RoomManager(dataStorage);
const gameManager = new GameManager(dataStorage, io);

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected!`);

  roomManager.addPlayer(socket);

  // Listen for messages from the client
  socket.on("gameMessage", (data) => {
    gameManager.handleGameAction(socket, data);
  });

  socket.on("roomMessage", (data) => {
    roomManager.handleRoomMessage(socket, data);
  });

  // Handles disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected!`);
    roomManager.deletePlayer(socket); // Remove player from the game state
  });
});

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
});