/**
 * socket.io simple chat example
 */
const router = require('express').Router()
const log4js = require('log4js')
const logger = log4js.getLogger('default')

/**
 * VIEW
 */
router.get('/', function(req, res) {
    res.sendFile(__dirname + '/view/index.html')
});

/**
 * Listener
 */
const listener = (io) => (socket) => {
    // namespace:client-side socket.io
    // const io = new io(namespace)
    const nsp = socket.nsp;
    const session = socket.request.session;
    logger.log('socket.io.chat.connect.on',session);

    /**
     * メッセージを受信した場合
     * @param {object} data
     */
    socket.on('message', (data) =>{
        logger.debug("socket.io.chat.message.on : %s", data)
        const {message} = data
        nsp.emit('message', {message: (socket.request.session.counter || '') + message})
    })

    /**
     * 切断された場合
     */
    socket.on('dissconnect', (socket) =>{
        log.debug('socket.io.chat.disconnect.on')
    })
}

module.exports = {router, listener}
