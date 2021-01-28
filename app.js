var express = require('express');
var path = require('path');
const database = require('./middleware/database')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const {sendJson} = require('./middleware/generateResponse')
const error = require("./middleware/error");

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.response.sendJson = sendJson

//Database connection
database.connect()
//Routes
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/post',require('./routes/post'))
app.use('/comment',require('./routes/comment'))

//Swagger UI
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument))
app.use('/api-docs',express.Router())

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler, send stacktrace only during development
// app.use(error.handler)
  
// if error is not instance of APIError, convert it
app.use(error.converter)

// catch 404 and forward to error handler
app.use(error.notFound)



module.exports = app;
