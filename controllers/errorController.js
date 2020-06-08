let AppError = require('./../utils/appError');

let handleCastErrorDb = err => {
  let message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}

let handleDuplicateFieldDb = err => {
  //let value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  //console.log(value);
  let message = `Duplicate field value, Please use another value!!!`;
  return new AppError(message, 400);
}

let sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

let sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  // Programming or Other unknown Error: Don't leak error details
  }
  else {
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong !!!'
    })
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
  else if (process.env.NODE_ENV === 'production') {
    let error = {...err};
    /****** error.name = CastError missing here so use error.kind ******/
    if (error.kind === 'ObjectId') error = handleCastErrorDb(error);
    if (error.code === 11000) error = handleDuplicateFieldDb(error);
    sendErrorProd(error, res);
  }
}