require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport')

const usersRouter = require('./lib/v1.0/routers/users');
const bandsRouter = require('./lib/v1.0/routers/bands');
const membershipRequestsRouter = require('./lib/v1.0/routers/membershipRequests');

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize())
app.use(usersRouter);
app.use(bandsRouter);
app.use(membershipRequestsRouter);

require('./db/db')

require('./config/passport');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if (err.name === 'ValidationError') {
    err.status = 400
  }

  if (err.name === 'NotFoundError') {
    err.status = 400
  }

  // return the error message
  res.status(err.status || 500);
  res.send({error: { message: err.message} });
});

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`)
// })

module.exports = app;
