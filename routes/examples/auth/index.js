/**
 * Authenticatation Starter example
 * 
 * @auther N.Mizuno
 * @version 1.0.0
 */
const router = require('express').Router()
const log4js = require('log4js')
const logger = log4js.getLogger('default')

/**
 * 認証を行う
 * 
 * TODO: 認証を作成する
 * @param {String} id ユーザID
 * @param {String} pw パスワード
 * @returns 認証結果
 */
function authenticate(id, pw) {
    return (id == 'aaa' && pw == 'bbb');
}

/**
 * ログイン初期表示
 */
router.get('/login', function(req, res) {
    res.sendFile(__dirname + '/view/index.html')
});

/**
 * ログイン処理
 */
router.post('/login', function(req, res) {
    logger.debug('call login method.')
    const {userId, userPw} = {...req.body, ...req.params, ...req.query};
    if (authenticate(userId, userPw)){
        req.session.regenerate(()=>{
            req.session.userId = userId
            res.status('200').send({
                message:'authenticate success.',
                userid : userId
            });
        })
    } else {
        req.session.destroy();
        res.status('401').send({
            message:'authenticate failure.',
            userid : userId
        })
    }
});

/**
 * ログアウト処理
 */
router.get('/logout', function(req, res) {
    logger.debug('call logout method.')
    req.session.destroy();
    res.status('200').send({
        message:'logout'
    });
});

/**
 * 認証チェック
 */
router.use(function(req, res, next) {
    logger.debug('check session info.', req.session)
    if (req.session.userId) {
        next();
    } else {
        res.status('500').send({
            message:'session timeout'
        })
    }
})


/**
 * 制限リソースの取得
 */
router.get('/resource', function(req, res) {
    req.session.counter = (req.session.counter || 0) + 1 
    res.send({counter:req.session.counter})
});

module.exports = router;