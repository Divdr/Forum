const router = require('express').Router()
const COMMENT = require('../controller/comment')
const {destroy} = require('../validation/comment')
const {validate} = require('express-validation')

router.delete('/:Id',validate(destroy),COMMENT.destroy)

module.exports = router