/**
 * REST API Sample
 * 
 * @auther N.Mizuno
 * @version 1.0.0
 */
const router = require('express').Router()
const log4js = require('log4js')
const logger = log4js.getLogger('default')

/**
 * GET method
 */
router.get('/', function(req, res) {
    logger.debug('call get method')
    res.send({
        message:'hello world!',
        method : 'GET'
    });
});

/**
 * GET method url added parameter
 * ex) http://localhost/rest/api/v1/param/aaa?q=bbb
 * parameter:
 * => {params:'aaa'}
 * body:
 * => form input value or xhr send value
 * query:
 * => {params:'aaa'}
 */
router.get('/param/:param', function(req, res) {
    logger.debug('call get method')
    res.send({
        message:'hello world',
        method : 'GET',
        params : req.params,
        body   : req.body,
        query  : req.query,
    });
});

/**
 * POST method
 */
router.post('/', function(req, res) {
    res.send({
        message:'hello world',
        method : 'POST',
        params : req.params,
        body   : req.body,
        query  : req.query,
    });
});

/**
 * PUT method
 */
router.put('/', function(req, res) {
    res.send({
        message:'hello world',
        method : 'PUT',
        params : req.params,
        body   : req.body,
        query  : req.query,
    });
});

/**
 * DELETE method
 */
router.delete('/', function(req, res) {
    res.send({
        message:'hello world',
        method : 'DELETE',
        params : req.params,
        body   : req.body,
        query  : req.query,
    });
});

/**
 * nested Router
 */
{
    // 状況により子ルーターはモジュール化する
    const childRouter = require('express').Router();
    childRouter.get('/', function(req, res) {
        res.send({
            message:'child router',
            method : 'GET',
            params : req.params,
            body   : req.body,
            query  : req.query,
        });
    })
    router.use('/child', childRouter)
}

/**
 * nested Router extends parameter
 */
{
    // 親ルーターのURLで定義したパラメーターを継承する場合
    // mergeParamsオプションをtrueにする。
    const childRouter = require('express').Router({mergeParams:true});

    /**
     * ex) http://~~~/param1/aaa/param2/bbb
     * params=>{param1:'aaa', param2:'bbb'}
     */
    childRouter.get('/param2/:param2', function(req, res) {
        res.send({
            message:'child router',
            method : 'GET',
            params : req.params,
            body   : req.body,
            query  : req.query,
        });
    })
    router.use('/param1/:param1', childRouter)
}

module.exports = router;