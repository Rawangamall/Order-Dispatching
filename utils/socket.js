let io;

function init(_io) {
  io = _io;

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
