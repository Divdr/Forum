var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Role = require('../models/role')

/* GET home page. */
router.get('/',(req, res,next) =>{
  res.send("home page")
});



module.exports = router;
