const router = require('express').Router()
const POST = require('../controller/post')
const {isAuth} = require('../middleware/authentication')
const { validate } = require('express-validation')
const {show,create,update,destroy,isExists} = require('../validation/post')
const validateComment = require('../validation/comment')
const COMMENT = require('../controller/comment')

router.get('/',isAuth(['admin','user']),POST.showCustom)

router.get('/:Id',isAuth(['admin', 'user']),validate(show),isExists,POST.show)

router.post('/',isAuth(['admin','user']),validate(create),POST.store)

router.put('/:Id',isAuth(['admin','user']),validate(update),POST.update)

router.delete('/:Id',isAuth(['admin','user']),validate(destroy),POST.destroy)

router.get('/:Id/comment',validate(validateComment.show),isAuth(['admin','user']),COMMENT.all)

router.post('/:Id/comment',validate(validateComment.create),isAuth(['admin','user']),COMMENT.store)


module.exports = router