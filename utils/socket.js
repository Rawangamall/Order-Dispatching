const socketIO = require("socket.io");

let io;

function init(server) {
  io = socketIO(server);

  io.on("connection", (socket) => {
    console.log("New client connected");
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
}

module.exports = {
  init,
  getIO,
};
