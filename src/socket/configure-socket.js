const { Server } = require('socket.io')
const messageManager = require("../dao/messages.manager.js");

class SocketManager {
  #io;
  #sockets = [];
  constructor(httpServer) {
    this.#io = new Server(httpServer);
    this.#configure();
  }

  #configure() {
    this.#io.on('connection', (socket) => this.#configureSocket(socket));
  }

  #configureSocket(socket) {
    let credencial = `socket-${socket.id}`;
    this.#sockets.push({ socket, credencial })
    let messages = [];
    socket.on('message', data =>{
      messages.push(data);
      messageManager.create(data);
      this.#io.emit('messageLogs', messages)
    })
  }

  getSocketServer() {
    return this.#io;
  }
  getSocket(credencial) {
    return this.#sockets.find((c) => c.credencial === credencial);
  }
}

let socketManager = undefined;

function configureSocket(httpServer) {
  if (socketManager === undefined) {
    socketManager = new SocketManager(httpServer);
  }
  return socketManager;
}

module.exports = socketManager;
module.exports = configureSocket;
