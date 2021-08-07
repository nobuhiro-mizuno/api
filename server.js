/**
 * Express Quick Starter
 * 
 * @version 1.1.0
 * @auther N.Mizuno
 */

// cluster
const cluster = require('cluster')
const numCPUs = require('os').cpus().length;

// server
const http = require('http')
const https = require('https')
const socketIO = require('socket.io')

// express
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')

// utilities
const fs = require('fs')
const path = require('path')
const log4js = require('log4js')
const config = require('config')

// routers
const router = require('./routes/api')
const listner = require('./routes/ws')

// ロガーの初期化
log4js.configure(config.log)

// cluster 設定
cluster.on('exit', function(worker, code, signal) {
  const logger = log4js.getLogger('server')
  console.error(`worker died with signal`, worker.process.pid);
  cluster.fork();
});

// cluster 作成
if (cluster.isMaster) {
  const logger = log4js.getLogger('server')
  
  logger.info(`Master %s is running`, process.pid)
  logger.info('worker initalize...')
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  logger.info('worker initalized', numCPUs)
} else {

  // expressを作成
  const app = express()

  // アクセスログ
  {
    const logger = log4js.getLogger('access')
    app.use(log4js.connectLogger(logger))
  }

  //セッションの設定
  {
    //Cookie設定
    app.use(cookieParser())

    //セッション設定
    app.use(
      session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: config.server.https || false,
          maxAge: config.server.session.timeout * 60 * 1000
        }
      })
    )
  }

  // パース設定
  {
    // URLエンコード形式
    app.use(express.urlencoded({extended: false}))
    // JSON形式
    app.use(express.json())
  }

  // パラメータログ
  {
    const logger = log4js.getLogger('params')
    app.use(function (req, res, next) {
      const {query, params, body} = req
      logger.info({query, params, body})
      next()
    })
  }

  //公開ディレクトリの設定
  app.use(express.static(path.join(__dirname, config.server.public || 'public')))

  // ルーター初期化
  router(app)

  //404 Not Found
  app.use('/', function (req, res, next) {
    res.status(404).send('404')
  })

  // server
  const server = config.server.https.use || false
    ? https.createServer({
        key : fs.readFileSync(config.server.https.key),
        cert: fs.readFileSync(config.server.https.cert)
      }, app)
    : http.createServer(app)

  // Socket.IO
  if (config.server.socketIO.use) {
    const io = socketIO.listen(server)
    io.on('connection', listner(io))
  }

  // サーバ起動
  server.listen(
    config.server.port,
  () => {
    const host = server.address().address
    const port = server.address().port
    const env  = app.get('env')
    const logger = log4js.getLogger('server')
    logger.info('worker %d start server env:%s host:%s, port:%s', process.pid, env, host, port)
  })

}

