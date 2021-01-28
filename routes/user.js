var router = require('express').Router()
const {login,signup,makeAdmin} = require('../validation/user')
const { validate } = require('express-validation')
const {isAuth} = require('../middleware/authentication')

const USER = require('../controller/user')


router.post("/",validate(signup),USER.signup);

router.post("/login",validate(login),USER.login);

router.post("/admin/",validate(makeAdmin),isAuth(['admin']),USER.makeAdmin);

module.exports = router;
