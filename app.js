'use strict';

const createError = require('http-errors');
const express = require('express');
const ath = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/shopping';
mongoose.connect(url);
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const expressHbs = require('express-handlebars');
const MongoStore = require('connect-mongo')(session); // must be imported after declaring the 'session' var above

// Import the passport configuration
require('./config/passport');

// Create the main application
const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://192.168.0.32:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Declare routing variables
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

//-------------------------------------------------------------------------
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
//app.set('view engine', 'hbs');
app.set('view engine', '.hbs');

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(validator());

app.use(cookieParser());

// We don't actually want to store the session in memory as we have:
// 1) memory leaks
// 2) things are not optimized in any way
app.use(session({
  secret: 'mysupersecret', 
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
})); // maxAge = 3hrs but for testing you'd want to set this to 10secs

// Use flash messaging for errors
app.use(flash());

// Initialize passport usage
app.use(passport.initialize());
app.use(passport.session());

// Declare the static file directory
app.use(express.static(path.join(__dirname, 'public')));

// authenticate?
app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use('/user', userRouter);
app.use('/', indexRouter);

//-------------------------------------------------------------------------
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
