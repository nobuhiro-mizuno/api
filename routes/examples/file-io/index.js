/**
 * File Download / Upload exsample
 * @see https://github.com/expressjs/multer
 */
const router = require('express').Router()
const log4js = require('log4js')
const logger = log4js.getLogger('default')

const multer = require('multer')
const upload = multer(/** {dest: 'save-to-path'} */)
/*
//ファイル保存先・保存名を定義して処理する場合
const storage = multer.diskStorage({
    destination : (req, file, fn) => fn(null, '/tmp/my-uploads'),
    filename    : (req, file, fn) => fn(null, file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9))
const upload = multer({ storage: storage })
})
*/

router.get('/', function(req, res) {
    logger.debug('exsamples.file-io.get')
    res.sendFile(__dirname + '/view/index.html')
});

router.post('/', upload.any()/** upload.single(name) or upload.array(name, limit) */, function(req, res) {
    logger.debug('exsamples.file-io.post')
    const file = req.files[0];
    res.setHeader('Content-disposition', `attachment; filename=${file.originalname}`);
    res.send(file.buffer.toString());
});

module.exports = router
