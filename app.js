let express = require('express');
let morgan = require('morgan');
let tourRouter = require('./routes/tourRoutes');
let userRouter = require('./routes/userRoutes');

let app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from our Middleware');
  next();
})
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

// Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;