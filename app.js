let express = require('express');
let morgan = require('morgan');
let rateLimit = require('express-rate-limit');
let helmet = require('helmet');

let AppError = require('./utils/appError');
let globalErrorHandler = require('./controllers/errorController');
let tourRouter = require('./routes/tourRoutes');
let userRouter = require('./routes/userRoutes');

let app = express();

/******* Middlewares List ******/ 

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
let limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour !!!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Serving static files
app.use(express.static(`${__dirname}/resources/public`)); 

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

// Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!!!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;