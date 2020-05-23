const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

// When all clients connect to SocketIO,
// this io.on("connecton") function will be triggered
module.exports = {
  socket: (any = io.on("connection", (socket) => {
    console.log("User Socket Connected");

    // When one of the clients ilogs out,
    // this socket.on(“disconnect”) function will be triggered
    socket.on("disconnect", () =>
      console.log(`${socket.id} User disconnected.`)
    );
  })),
};

//  SocketIO and Consumer are published from 1923 port
server.listen(1923);
