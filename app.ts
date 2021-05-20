var createError = require('http-errors');

import express from 'express';

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

import fetch from 'node-fetch';

import firebase from 'firebase/app';
import 'firebase/firestore';

import indexRouter from './routes/index';

const fbase = firebase.initializeApp({});

const db = fbase.firestore();

setInterval(() => {
  fetch('http://api.open-notify.org/iss-now.json').then(async (res) => {
    const location = await res.json();

    const doc = db.collection('locations').doc(String(location.timestamp));

    doc.set(location);
  });
}, 30000);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
