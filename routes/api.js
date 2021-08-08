/**
 * REST API系のルーティング
 * 
 * @auther N.Mizuno
 */
//TODO: 実装したものを読み込む
const chatRouter   = require('./examples/chat').router
const fileIORouter = require('./examples/file-io')
const restRouter   = require('./examples/rest')
const authRouter   = require('./examples/auth')

//TODO: 実装したものを登録する
module.exports = (app) => {
  app.use('/file-io/api/v1/', fileIORouter)
  app.use('/chat/api/v1/', chatRouter)
  app.use('/rest/api/v1/', restRouter)
  app.use('/auth/api/v1/', authRouter)
  app.get('/',(req, res) => {
    res.sendFile(__dirname + '/examples/examples.html')
  })
  return app
}