var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = createError(404, "We couldn't find the page you were looking for.");
  err.error = "Page Not Found";
  console.log('Handling 404');
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log('Handling general error');
  // set locals, only providing error in development
  err.error = err.error ||  'Server Error';
  res.locals.message = err.message || 'There was an unexpected error on the server.';
  res.locals.error = req.app.get('env') === 'development' ? err.error : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
