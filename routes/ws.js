// モジュール出力
module.exports = (io) => (socket) => {
  // message
  socket.on('message', listner(socket, function (data) {
    io.to(socket.id).emit('response', {value : 'response:' + data})
  }))
}