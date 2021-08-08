/**
 * socket.ioのルーティング
 * 
 * @auther N.Mizuno
 * @version 1.0.0
 */
//TODO: 実装したものを読み込む
const msgListener = require("./examples/chat").listener;
module.exports = (io) => {
  //TODO: 実装したものを登録する
  io.of('/chat').on('connection', msgListener(io))
}