var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;


// {
//     "subject": "mailto:gareth.nolan@newswhip.com",
//     "publicKey": "BGmS0CC1dDute0bRgXzjzK33-GNWJMS1UyJXA3B9l2pvEYXYuXVg1jgyxypisr7G_zt6zYWlrW-WOxs9S_3XAFg",
//     "privateKey": "YLvGc_FPU7zjiGrDQLfyFP8MF3BJ8ePaA2ILLouPiFA"
//   }