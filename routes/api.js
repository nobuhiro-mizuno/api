/**
 * REST API系のルーティング
 * 
 * @auther N.Mizuno
 */
var router = require('express').Router()

//
router.use('/', function (req, res) {
})

// 本体に登録
module.exports = (app) => {
  app.use('/api', router)
  return app
}